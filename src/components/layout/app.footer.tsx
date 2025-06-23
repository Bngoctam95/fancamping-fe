const AppFooter = () => {
    return (
        <footer className="bg-primary text-white py-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-montserrat font-bold text-2xl mb-4">About Us</h3>
                        <p className="text-gray-300 mb-6">
                            We are a team of outdoor enthusiasts who are passionate about helping people find the best
                            outdoor gear.
                        </p>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <div className="container mx-auto px-6">
                        <p className="text-center text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} Outdoor Gear Hub. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
