import Logout from "../../pages/login/logout";

export default function Navbar() {
    return (
        <div className="w-full h-[60px] bg-[#1A1A1A] text-white ">
            <nav className="p-4 flex justify-end gap-6 items-center fixed top-0 right-0 left-[300px]">
                <span>notification</span>
                <span>user name</span>
                <Logout/>
            </nav>
        </div>
    );
}