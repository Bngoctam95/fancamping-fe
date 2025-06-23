import { Link } from 'react-router-dom';

const CallAction = () => {
    return (
        <section className="py-20 bg-[#789b86] bg-center relative">
            <div className="absolute inset-0 bg-accent bg-opacity-80"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-montserrat font-bold text-4xl text-white mb-6">
                        Sẵn Sàng Cho Cuộc Phiêu Lưu Tiếp Theo?
                    </h2>
                    <p className="font-opensans text-white text-lg mb-10">
                        Tìm kiếm thiết bị phù hợp với nhu cầu của bạn và bắt đầu cuộc phiêu lưu của bạn ngay hôm nay!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/equipment">
                            <button className="bg-white text-accent hover:bg-gray-100 font-montserrat font-semibold px-8 py-6 h-auto rounded-lg">
                                Xem thiết bị
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-secondary hover:bg-secondary/90 text-white font-montserrat font-semibold px-8 py-6 h-auto rounded-lg">
                                Tạo tài khoản
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallAction;
