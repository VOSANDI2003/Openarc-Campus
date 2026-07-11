import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    LucideFileUser,
    LucideUser,
    LucideUser2,
    LucideUserRoundPen,
    Users,
    ClipboardList,
    BadgeDollarSign,
    GraduationCap,
    CalendarDays,
    BarChart3,
} from 'lucide-react';
import AppLogo from './app-logo';

// ── Super Admin sees everything ────────────────────────────────────────────────
const superAdminNavItems: NavItem[] = [
    { title: 'Dashboard',   href: '/dashboard',    icon: LayoutGrid },
    { title: 'Super Admin', href: '/super-admins', icon: LucideUserRoundPen },
    { title: 'Admin',       href: '/admins',       icon: LucideUser2 },
    { title: 'Front Desk',  href: '/front-desks',  icon: LucideFileUser },
    { title: 'Lecturer',    href: '/lecturers',    icon: LucideUser },
    { title: 'Student',     href: '/students',     icon: Users },
    { title: 'Semesters', href: '/semesters', icon: CalendarDays },
    { title: 'Student List Report', href: '/reports/students', icon: ClipboardList },
    { title: 'Enrollment Summary',  href: '/reports/enrollment-summary', icon: BarChart3 },
];

// ── Admin ──────────────────────────────────────────────────────────────────────
const adminNavItems: NavItem[] = [
    { title: 'Dashboard',  href: '/dashboard',   icon: LayoutGrid },
    { title: 'Front Desk', href: '/front-desks', icon: LucideFileUser },
    { title: 'Lecturer',   href: '/lecturers',   icon: LucideUser },
    { title: 'Student',    href: '/students',    icon: Users },
    { title: 'Semesters', href: '/semesters', icon: CalendarDays },
    { title: 'Student List Report', href: '/reports/students', icon: ClipboardList },
    { title: 'Enrollment Summary',  href: '/reports/enrollment-summary', icon: BarChart3 },
];

// ── Front Desk ─────────────────────────────────────────────────────────────────
const frontDeskNavItems: NavItem[] = [
    { title: 'Dashboard',        href: '/dashboard',        icon: LayoutGrid },
    { title: 'Fee Verification', href: '/fee-verification', icon: BadgeDollarSign },
    { title: 'Students',         href: '/students',         icon: Users },
];

// ── Lecturer ───────────────────────────────────────────────────────────────────
const lecturerNavItems: NavItem[] = [
    { title: 'Dashboard',   href: '/dashboard',    icon: LayoutGrid },
];

// ── Student ────────────────────────────────────────────────────────────────────
const studentNavItems: NavItem[] = [
    { title: 'Dashboard',  href: '/dashboard',  icon: LayoutGrid },
    //{ title: 'Enrollment', href: '/enrollment', icon: GraduationCap },
    { title: 'Fee Status', href: '/fee-status', icon: BadgeDollarSign },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

function getNavItems(role: string): NavItem[] {
    switch (role) {
        case 'super_admin': return superAdminNavItems;
        case 'admin':       return adminNavItems;
        case 'frontdesk':   return frontDeskNavItems;
        case 'lecturer':    return lecturerNavItems;
        case 'student':     return studentNavItems;
        default:            return [];
    }
}

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const role = auth?.user?.role ?? '';
    const navItems = getNavItems(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
