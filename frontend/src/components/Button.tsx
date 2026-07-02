import type React from "react";

type ButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
    return (
        <button className="p-4 bg-green-500 text-white rounded-md cursor-pointer font-semibold min-w-40" onClick={onClick}>
            {children}
        </button>
    )
}

export default Button