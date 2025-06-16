import { formatDate } from 'services/helper';
import { Calendar, ClipboardPenLine, Edit3, Trash2 } from 'lucide-react';
import { Popconfirm } from 'antd';

interface IPostCardProps {
    post: IPostTable;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isShowAction?: boolean;
}

const PostCard = ({ post, onEdit, onDelete, isShowAction = true }: IPostCardProps) => {
    const handleDelete = () => {
        onDelete?.(post._id);
    };

    return (
        <div
            className={`bg-white flex flex-col md:flex-row items-start justify-between p-4 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border ${
                post.status === 'pending'
                    ? 'border-orange-400'
                    : post.status === 'draft'
                      ? 'border-gray-400'
                      : post.status === 'published'
                        ? 'border-green-400'
                        : 'border-red-400'
            }`}
        >
            <div className="w-full">
                <h4 className="text-xl font-bold mb-3 font-montserrat line-clamp-2 hover:line-clamp-none transition-all duration-200">
                    {post.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 font-semibold bg-gray-100 px-2 py-1 rounded-full">
                        <span>Danh mục:</span>
                        {post.categoryId?.name}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1 font-semibold">
                        <Calendar size={14} />
                        {formatDate(post.createdAt)}
                    </div>
                    <div
                        className={`flex items-center gap-1 capitalize text-white px-2 py-1 rounded-full text-sm font-semibold ${
                            post.status === 'pending'
                                ? 'bg-pending'
                                : post.status === 'draft'
                                  ? 'bg-draft'
                                  : post.status === 'published'
                                    ? 'bg-published'
                                    : 'bg-archived'
                        }`}
                    >
                        <ClipboardPenLine size={14} />
                        {post.status}
                    </div>
                </div>
                <p className="mb-4 font-montserrat text-gray-600 line-clamp-2 hover:line-clamp-none transition-all duration-200">
                    {post.subTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            {isShowAction && (post.status === 'draft' || post.status === 'pending') && (
                <div className="flex items-center gap-2 mt-4 md:mt-0 md:ml-4">
                    <button
                        onClick={() => onEdit?.(post._id)}
                        className="p-2 rounded hover:bg-gray-100 transition-all duration-200 group relative"
                        style={{ color: '#2D5016' }}
                        aria-label="Edit post"
                        title="Chỉnh sửa bài viết"
                    >
                        <Edit3 size={18} />
                    </button>

                    <Popconfirm
                        title="Xóa bài viết"
                        description="Bạn có chắc chắn muốn xóa bài viết này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="leftTop"
                        onConfirm={handleDelete}
                    >
                        <span className="cursor-pointer text-orange-500 hover:bg-gray-100 rounded-sm p-2">
                            <Trash2 size={18} />
                        </span>
                    </Popconfirm>
                </div>
            )}
        </div>
    );
};

export default PostCard;
