import React, { useEffect, useRef } from "react"; // 1. Import useEffect and useRef
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { PlusIcon, ListIcon } from "../icons";
import { useNavigate } from "react-router";

export default function TaxEntry() {
    const navigate = useNavigate();

    // 2. Create a reference for the button
    const viewEntriesBtnRef = useRef<HTMLButtonElement>(null);

    // 3. Focus the button on mount
    useEffect(() => {
        if (viewEntriesBtnRef.current) {
            viewEntriesBtnRef.current.focus();
        }
    }, []);

    return (
        <>
            <PageMeta
                title="Tax Entry"
                description="Tax Entry page"
            />
            <PageBreadcrumb pageTitle="Tax Entry" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-8 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-10">
                    Tax Entry Management
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                    {/* View List Card */}
                    <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 transition-all duration-300 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:from-blue-900/20 dark:to-blue-800/10 dark:hover:border-blue-400">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-200 opacity-20 dark:bg-blue-500/20"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform group-hover:scale-110">
                                <ListIcon className="h-8 w-8" />
                            </div>
                            <h4 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                                View List
                            </h4>
                            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                View all existing tax entries and manage them
                            </p>
                            <button
                                ref={viewEntriesBtnRef}
                                onClick={() => navigate("/operator-dashboard/view-tax-list")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all 
                                hover:bg-blue-600 
                                active:scale-95 
                                /* High Visibility Focus Styles */
                                focus:outline-none 
                                focus:ring-2
                                focus:ring-blue-500
                                focus:ring-offset-2
                                focus:border-blue-700 
                                dark:focus:ring-offset-gray-900"
                            >
                                <ListIcon className="h-4 w-4" />
                                View Entries
                            </button>
                        </div>
                    </div>

                    {/* Add New Entry Card */}
                    <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-8 transition-all duration-300 hover:border-green-500 hover:shadow-lg dark:border-gray-700 dark:from-green-900/20 dark:to-green-800/10 dark:hover:border-green-400">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-200 opacity-20 dark:bg-green-500/20"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform group-hover:scale-110">
                                <PlusIcon className="h-8 w-8" />
                            </div>
                            <h4 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                                Add New Entry
                            </h4>
                            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                Create a new tax entry in the system
                            </p>
                            <button
                                onClick={() => navigate("/operator-dashboard/add-new-entry")}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-600 
                                focus:outline-none 
                                focus:ring-2
                                focus:ring-green-500
                                focus:ring-offset-2
                                focus:border-green-700 
                                dark:focus:ring-offset-gray-900"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Entry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}