'use client';

import { FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const BreadCrumb = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);

    const generateBreadcrumbs = () => {
        const breadcrumbs = [];
        let accumulatedPath = '';

        for (let i = 0; i < pathSegments.length; i++) {
            accumulatedPath += `/${pathSegments[i]}`;
            const name = pathSegments[i].replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

            breadcrumbs.push({
                name,
                path: accumulatedPath,
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <>
            <nav className="breadcrumb-container">
                <Link href="/" className="breadcrumb-link home-link">
                    <FaHome className="home-icon" />
                    Home
                </Link>
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        <span className="breadcrumb-separator">›</span>
                        <Link
                            href={crumb.path}
                            className={`breadcrumb-link ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                        >
                            {crumb.name}
                        </Link>
                    </React.Fragment>
                ))}

            </nav>
        </>
    );
};

export default BreadCrumb;
