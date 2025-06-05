import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
    return (
        <div>
            <h1>Layout Admin</h1>
            <Outlet />
        </div>
    )
}

export default LayoutAdmin;

