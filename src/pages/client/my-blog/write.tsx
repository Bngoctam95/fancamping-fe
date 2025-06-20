import { createPostAPI, getPostCategoriesAPI, uploadPostThumbnailAPI } from '@/services/api';
import { App, Select, Upload } from 'antd';
import { useState, useEffect } from 'react';
import DropdownDefault from '@/components/ui/dropdown';
import type { UploadFile, UploadProps } from 'antd/lib';
import type { GetProp } from 'antd';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from '@/components/ui/tiptap-editor/tiptap.editor';

interface DropdownOption {
    _id: string;
    text: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const WriteBlogPage = () => {
    const [blogContent, setBlogContent] = useState('');
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<IEquipmentCategory[]>([]);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const { message } = App.useApp();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllCategories = async () => {
            const res = await getPostCategoriesAPI();
            if (res?.data) {
                const categories = res.data as unknown as IEquipmentCategory[];
                setCategories(categories);
            } else {
                message.error(res?.message || 'Lỗi khi tải danh mục');
            }
        };

        fetchAllCategories();
    }, []);

    const handleCategorySelect = (option: DropdownOption) => {
        setCategory(option.text);
        setCategoryId(option._id);
    };

    const handleSaveDraft = async () => {
        if (!title || !subTitle || !blogContent || !thumbnail || !categoryId || tags.length === 0) {
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        setIsSaving(true);
        try {
            let parsedContent;
            try {
                parsedContent = JSON.parse(blogContent);
            } catch {
                message.error('Lỗi khi xử lý nội dung');
                setIsSaving(false);
                return;
            }

            const res = await createPostAPI(
                title,
                subTitle,
                thumbnail,
                categoryId,
                tags,
                parsedContent,
                'blog',
                slug,
                'draft'
            );

            if (res?.data) {
                message.success('Lưu nháp thành công');
                resetForm();
                navigate('/my-blog/list');
            } else {
                message.error(res?.message || 'Lỗi khi lưu nháp');
            }
        } catch {
            message.error('Lỗi khi lưu nháp');
        }
        setIsSaving(false);
    };

    const resetForm = () => {
        setTitle('');
        setSubTitle('');
        setSlug('');
        setBlogContent('');
        setThumbnail('');
        setCategory('');
        setCategoryId('');
        setTags([]);
        setFileListThumbnail([]);
    };

    const handlePublish = async () => {
        if (!title || !subTitle || !blogContent || !thumbnail || !categoryId || tags.length === 0) {
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        setIsSaving(true);

        try {
            let parsedContent;
            try {
                parsedContent = JSON.parse(blogContent);
            } catch {
                message.error('Lỗi khi xử lý nội dung');
                return;
            }

            const res = await createPostAPI(
                title,
                subTitle,
                thumbnail,
                categoryId,
                tags,
                parsedContent,
                'blog',
                slug,
                'pending'
            );

            if (res?.data) {
                message.success('Đăng bài thành công');
                resetForm();
                navigate('/my-blog/list');
            } else {
                message.error(res?.message || 'Lỗi khi đăng bài');
            }
        } catch {
            message.error('Lỗi khi đăng bài');
        }
        setIsSaving(false);
    };

    const beforeUploadThumbnail = (file: FileType) => {
        const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isValidFormat) {
            message.error('You can only upload JPG/PNG/WebP file!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
            return Upload.LIST_IGNORE;
        }
        return isValidFormat && isLt5M;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUploadThumbnail = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const res = await uploadPostThumbnailAPI(file);
            if (res?.data) {
                const uploadFile: UploadFile = {
                    uid: file.uid,
                    name: res.data,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${res.data}`,
                };
                setFileListThumbnail([{ ...uploadFile }]);
                setThumbnail(res.data);
                if (onSuccess) onSuccess('ok');
            } else {
                if (onError) onError(new Error(res.message || 'Upload failed'));
                message.error(res.message || 'Upload failed');
            }
        } catch {
            message.error('Upload failed');
        }
    };

    const handleRemoveThumbnail = () => {
        setFileListThumbnail([]);
        setThumbnail('');
        return true;
    };

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[đĐ]/g, 'd') // Replace Vietnamese 'd'
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/-+/g, '-') // Replace multiple - with single -
            .trim(); // Trim - from start and end of text
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        setSlug(slug);
    };

    return (
        <section className="py-8 bg-canvas min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto font-montserrat">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold font-montserrat">Tạo Blog Mới</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                                className={`${
                                    isSaving ? 'bg-gray-400' : 'bg-zinc-600'
                                } text-white text-sm font-semibold px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity flex items-center gap-2`}
                            >
                                {isSaving ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>Lưu nháp</>
                                )}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={isSaving}
                                className={`${
                                    isSaving ? 'bg-gray-400' : 'bg-campfire'
                                } text-white text-sm font-semibold px-4 py-2 rounded-lg border hover:opacity-90 transition-opacity`}
                            >
                                Đăng bài
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Blog Info Section */}
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Thông tin bài viết</h3>

                            <div className="space-y-6">
                                {/* Thumbnail */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Ảnh Thumbnail <span className="text-red-500">*</span>
                                    </label>
                                    <Upload
                                        name="thumbnail"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={true}
                                        maxCount={1}
                                        fileList={fileListThumbnail}
                                        customRequest={handleUploadThumbnail}
                                        beforeUpload={beforeUploadThumbnail}
                                        onRemove={handleRemoveThumbnail}
                                    >
                                        {fileListThumbnail.length < 1 && (
                                            <div>
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                                {/* Title */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tiêu đề bài viết..."
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            handleNameChange(e);
                                        }}
                                        className="w-full text-base outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 bg-gray-50"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                        Mô tả ngắn <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                                        value={subTitle}
                                        onChange={(e) => setSubTitle(e.target.value)}
                                        className="w-full h-20 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Tags */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-2">
                                            Tags <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            mode="tags"
                                            className="w-full h-10 rounded-lg"
                                            placeholder="Nhập tags"
                                            tokenSeparators={[',']}
                                            value={tags}
                                            onChange={setTags}
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-2">
                                            Danh mục <span className="text-red-500">*</span>
                                        </label>
                                        <DropdownDefault
                                            options={[
                                                ...categories.map((category) => ({
                                                    _id: category._id,
                                                    text: category.name,
                                                })),
                                            ]}
                                            onSelect={handleCategorySelect}
                                            value={category}
                                            className="w-full"
                                            style={{
                                                height: '40px',
                                                backgroundColor: 'white',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Editor */}
                            <div className="mt-6">
                                <label className="block text-base font-medium text-gray-700 mb-2">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>
                                <div className="border rounded-lg overflow-hidden">
                                    <TiptapEditor content={blogContent} onChange={setBlogContent} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WriteBlogPage;
