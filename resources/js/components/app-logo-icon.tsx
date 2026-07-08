import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            {...props}
        >
            <path
                d="M32 2L6 10V28C6 44 16 56 32 62C48 56 58 44 58 28V10L32 2Z"
                stroke="#0056B3"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            <path
                d="M20 38C20 38 28 34 32 34C36 34 44 38 44 38"
                stroke="#007BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M20 38V46C20 47.1046 20.8954 48 22 48H30V38"
                stroke="#007BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M44 38V46C44 47.1046 43.1046 48 42 48H34V38"
                stroke="#007BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="20" cy="18" r="2.5" fill="#00A8E8"/>
            <circle cx="32" cy="14" r="2.5" fill="#00A8E8"/>
            <circle cx="44" cy="18" r="2.5" fill="#00A8E8"/>
            <path
                d="M20 18H32M32 14H44"
                stroke="#00A8E8"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}