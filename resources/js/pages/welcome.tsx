import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">

                        {/* Left — text content */}
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-2xl font-semibold">
                                Welcome to OpenArc Campus
                            </h1>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                A smart campus management platform for students, lecturers, and staff.
                            </p>

                            <ul className="flex flex-col gap-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-blue-500">✦</span>
                                    <span>Manage student enrollments and semester records</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-blue-500">✦</span>
                                    <span>Track fee payments and verification status</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-blue-500">✦</span>
                                    <span>Role-based access for admins, lecturers, and front desk</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-0.5 text-blue-500">✦</span>
                                    <span>Secure login with account management</span>
                                </li>
                            </ul>
                        </div>

                        {/* Right — campus illustration */}
                        <div className="relative -mb-px flex w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-950 to-blue-900 lg:mb-0 lg:-ml-px lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-[#0d1b2a] dark:to-[#1a2f4a]">
                            <div className="flex flex-col items-center justify-center gap-6 px-10 py-16 text-center">

                                {/* Logo / Icon */}
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                                    <AppLogoIcon className="h-12 w-12" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white">OpenArc Campus</h2>
                                    <p className="mt-1 text-sm text-blue-200">Campus Management System</p>
                                </div>

                            </div>

                            {/* Decorative circles */}
                            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10" />
                            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-400/10" />
                        </div>

                    </main>
                </div>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}