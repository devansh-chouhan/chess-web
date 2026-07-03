import type React from "react";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
    return (
        <button 
            className="px-8 py-4 bg-[#81b64c] hover:bg-[#8fd053] text-white rounded-xl shadow-[0_5px_0_0_#537a2d] hover:shadow-[0_2px_0_0_#537a2d] hover:translate-y-[3px] transition-all duration-150 font-bold text-xl min-w-40 active:shadow-none active:translate-y-[5px]" 
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button