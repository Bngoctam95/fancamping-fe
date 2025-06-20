import ContentDetail from '@/components/blog/content.detail';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

interface IViewBlogModalProps {
    openViewBlog: boolean;
    setOpenViewBlog: (open: boolean) => void;
    blogView: IPostTable | null;
}

const ViewBlogModal = ({ openViewBlog, setOpenViewBlog, blogView }: IViewBlogModalProps) => {
    const [thumbnail, setThumbnail] = useState<string>('');

    useEffect(() => {
        if (blogView?.thumbnail) {
            setThumbnail(`${import.meta.env.VITE_BACKEND_URL}uploads/posts/thumbnails/${blogView.thumbnail}`);
        } else {
            setThumbnail('');
        }
    }, [blogView?.thumbnail]);

    return (
        <Modal open={openViewBlog} onCancel={() => setOpenViewBlog(false)} footer={null} width={1000}>
            {/* Thumbnail */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Thumbnail</label>
                <img src={thumbnail} alt="Thumbnail" className="w-full h-auto" />
            </div>
            {/* Title */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input
                    type="text"
                    value={blogView?.title}
                    disabled
                    className="w-full text-base outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 bg-gray-50"
                />
            </div>
            {/* subtitle */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                <textarea
                    value={blogView?.subTitle}
                    disabled
                    className="w-full h-20 p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                />
            </div>
            {/* Category */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Danh mục</label>
                <input
                    type="text"
                    value={blogView?.categoryId?.name}
                    disabled
                    className="w-full text-base outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3 bg-gray-50"
                />
            </div>
            {/* Tags */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {blogView?.tags.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            {/* Content */}
            <div className="mb-4">
                <label className="block text-base font-medium text-gray-700 mb-2">Nội dung</label>
                <ContentDetail content={blogView?.content || ''} />
            </div>
        </Modal>
    );
};

export default ViewBlogModal;
