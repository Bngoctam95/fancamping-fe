import { updateUserAvatarAPI } from 'services/api';
import { UserOutlined } from '@ant-design/icons';
import { App, Avatar } from 'antd';
import { useCurrentApp } from 'hooks/useCurrentApp';

const ProfilePage = () => {
    const { user, setUser } = useCurrentApp();
    const { message } = App.useApp();

    const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            message.error('File size must be less than 2MB');
            return;
        }

        // Check file format
        const allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormats.includes(file.type)) {
            message.error('Only JPG, PNG and WEBP formats are allowed');
            return;
        }

        try {
            const response = await updateUserAvatarAPI(file);
            if (response.data) {
                message.success('Avatar updated successfully');
                // Update user state with new avatar
                if (user) {
                    setUser({ ...user, avatar: response.data.avatar });
                }
            }
        } catch {
            message.error('Failed to update avatar');
        }
    };

    return (
        <section className="py-8 bg-canvas">
            <div className="container mx-auto px-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Profile</h3>
                    <div className="space-y-6">
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                    <div className="relative drop-shadow-2 w-24 h-24">
                                        {user?.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}uploads/users/${user?.avatar}`}
                                                alt="profile"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <Avatar
                                                size="large"
                                                icon={<UserOutlined />}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )}
                                        <label
                                            htmlFor="profile"
                                            title="Change avatar"
                                            className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                                    fill=""
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                                    fill=""
                                                />
                                            </svg>
                                            <input
                                                type="file"
                                                name="profile"
                                                id="profile"
                                                accept="image/*"
                                                onChange={handleChangeAvatar}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                    <div className="order-3 xl:order-2">
                                        <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                            {user?.name}
                                        </h4>
                                        <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        Personal Information
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Name
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {user?.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Email address
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Phone
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {user?.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Role
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {user?.role === 'super_admin'
                                                    ? 'Super Admin'
                                                    : user?.role === 'admin'
                                                      ? 'Admin'
                                                      : user?.role === 'mod'
                                                        ? 'Moderator'
                                                        : 'User'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                            fill=""
                                        />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        Address
                                    </h4>

                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Country
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                United States.
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                City/State
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                Phoenix, Arizona, United States.
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Postal Code
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                ERT 2489
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                TAX ID
                                            </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                AS4568384
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                            fill=""
                                        />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
