import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-5xl font-bold mb-4 text-red-600">404</h1>
            <p className="text-xl mb-4">Oops! Trang bạn đang tìm không tồn tại.</p>
            <Link to="/">
                <span className="p-2 bg-button hover:bg-button-hover text-white rounded-md">Quay về trang chủ</span>
            </Link>
        </div>
    );
};

export default NotFoundPage;