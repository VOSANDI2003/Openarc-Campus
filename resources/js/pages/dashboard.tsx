import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type PageProps } from '@/types';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Student {
    id: number;
    index_no: string;
    full_name: string;
    current_semester: number;
    email: string;
    contact: string;
}

interface Lecturer {
    id: number;
    full_name: string;
    email: string;
    subject: string;
}

interface Props extends PageProps {
    student?: Student;
    lecturer?: Lecturer;
}

export default function Dashboard() {
    const { auth, student, lecturer } = usePage<Props>().props;
    const role = auth?.user?.role ?? '';
    const userName = auth?.user?.name ?? '';
    const userEmail = auth?.user?.email ?? '';

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-6">

{/* Student Dashboard */}
{role === 'student' && (
    <>
        {student ? (
            <>
                <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-amber-500 mb-1">Hello, {student.full_name} 👋</h2>
                        <p className="text-sm text-muted-foreground">Here is your academic summary.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-amber-500">{formattedDate}</p>
                        <p className="text-sm text-muted-foreground">{formattedTime}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Student ID</h3>
                        <p className="mt-2 text-2xl font-bold text-blue-500">{student.index_no}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                        <p className="mt-2 text-2xl font-bold text-blue-500">{student.full_name}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Current Semester</h3>
                        <p className="mt-2 text-2xl font-bold text-blue-500">Semester {student.current_semester}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p className="mt-2 text-lg font-bold text-blue-500 break-all">{student.email}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                        <p className="mt-2 text-2xl font-bold text-blue-500">{student.contact}</p>
                    </div>
                </div>
            </>
        ) : (
            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Hello, {userName} 👋</h2>
                    <p className="text-sm text-muted-foreground">Your account is pending activation.</p>
                    <p className="text-sm text-muted-foreground mt-2">Please wait until an admin registers your student profile. Your dashboard will be available once that is done.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-white">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                </div>
            </div>
        )}
    </>
)}
                {/* Admin / Super Admin Dashboard */}
                {(role === 'admin' || role === 'super_admin') && (
                    <>
                        <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-amber-500 mb-1">Hello, {userName} 👋</h2>
                                <p className="text-sm text-muted-foreground">Here is your admin summary.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-amber-500">{formattedDate}</p>
                                <p className="text-sm text-muted-foreground">{formattedTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500">{userName}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p className="mt-2 text-lg font-bold text-blue-500 break-all">{userEmail}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500 capitalize">{role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Front Desk Dashboard */}
                {role === 'frontdesk' && (
                    <>
                        <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-amber-500 mb-1">Hello, {userName} 👋</h2>
                                <p className="text-sm text-muted-foreground">Here is your front desk summary.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-amber-500">{formattedDate}</p>
                                <p className="text-sm text-muted-foreground">{formattedTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500">{userName}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p className="mt-2 text-lg font-bold text-blue-500 break-all">{userEmail}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500 capitalize">{role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Lecturer Dashboard */}
                {role === 'lecturer' && (
                    <>
                        <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-amber-500 mb-1">Hello, {userName} 👋</h2>
                                <p className="text-sm text-muted-foreground">Here is your lecturer summary.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-amber-500">{formattedDate}</p>
                                <p className="text-sm text-muted-foreground">{formattedTime}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500">{userName}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p className="mt-2 text-lg font-bold text-blue-500 break-all">{userEmail}</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                                <p className="mt-2 text-2xl font-bold text-blue-500 capitalize">{role.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="rounded-xl border border-sidebar-border bg-background p-6 shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">My Subjects</h3>
                            {lecturer?.subject ? (
                                <p className="text-base font-bold text-blue-500">{lecturer.subject}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">No subjects assigned yet.</p>
                            )}
                        </div>
                    </>
                )}

            </div>
        </AppLayout>
    );
}