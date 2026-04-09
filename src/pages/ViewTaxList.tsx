import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { TrashBinIcon, PlusIcon, PencilIcon } from "../icons";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { DownloadIcon } from "../icons";

interface ReceiptEntry {
    id: string;
    receiptNumber: string;
    memberDetails: {
        customerNumber: string;
        date: string;
        agentNumber: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    addressDetails: {
        address1: string;
        address2: string;
        address3: string;
        pinCode: string;
        state: string;
        district: string;
        city: string;
        post: string;
        via: string;
        taluka: string;
        startIssue: string;
    };
    amount: string;
}

interface EntryData {
    operatorCode: string;
    bookNumber: string;
    parentAgentNumber: string;
    bookType: "OLD" | "NEW";
    toggles: {
        startSame: boolean;
        okUptoSame: boolean;
        languageSame: boolean;
        moneySame: boolean;
        agentSame: boolean;
        renewalSame: boolean;
    };
    receipts: ReceiptEntry[];
}

export default function ViewTaxList() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<EntryData[]>([]);

    // Filter states
    const [filterBookNumber, setFilterBookNumber] = useState("");
    const [filterBookType, setFilterBookType] = useState("");
    const [filterOperatorCode, setFilterOperatorCode] = useState("");
    const [filterParentAgent, setFilterParentAgent] = useState("");
    const [filterReceiptNumber, setFilterReceiptNumber] = useState("");

    useEffect(() => {
        // Fetch entries from localStorage
        const data = localStorage.getItem("taxEntries");
        if (data) {
            setEntries(JSON.parse(data));
        }
    }, []);

    const handleDelete = (index: number) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            const updatedEntries = entries.filter((_, i) => i !== index);
            setEntries(updatedEntries);
            localStorage.setItem("taxEntries", JSON.stringify(updatedEntries));
        }
    };

    // Filter logic
    const filteredEntries = entries.filter((entry) => {
        const bookNumberMatch = entry.bookNumber
            .toLowerCase()
            .includes(filterBookNumber.toLowerCase());
        const bookTypeMatch = filterBookType === "" || entry.bookType === filterBookType;
        const operatorMatch = entry.operatorCode
            .toLowerCase()
            .includes(filterOperatorCode.toLowerCase());
        const parentAgentMatch = entry.parentAgentNumber
            .toLowerCase()
            .includes(filterParentAgent.toLowerCase());
        const receiptNumberMatch =
            filterReceiptNumber === "" ||
            entry.receipts.some((receipt) =>
                receipt.receiptNumber
                    .toLowerCase()
                    .includes(filterReceiptNumber.toLowerCase())
            );

        return (
            bookNumberMatch &&
            bookTypeMatch &&
            operatorMatch &&
            parentAgentMatch &&
            receiptNumberMatch
        );
    });
    console.log("Filtered Entries:", filteredEntries);

    const clearFilters = () => {
        setFilterBookNumber("");
        setFilterBookType("");
        setFilterOperatorCode("");
        setFilterParentAgent("");
        setFilterReceiptNumber("");
    };

    return (
        <>
            <PageMeta
                title="View Tax Entries"
                description="View all tax entries"
            />
            <PageBreadcrumb pageTitle="Tax Entries" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        All Tax Entries
                    </h3>
                    <div className="flex gap-3">
                        <button
                            // onClick={handleDownloadDBF}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            Download DBF
                        </button>
                        <button
                            onClick={() => navigate("/operator-dashboard/tax-entry")}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Filters</h4>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <Label>Book Number</Label>
                            <Input
                                type="text"
                                value={filterBookNumber}
                                onChange={(e) => setFilterBookNumber(e.target.value)}
                                placeholder="Book number"
                            />
                        </div>
                        <div>
                            <Label>Book Type</Label>
                            <select
                                value={filterBookType}
                                onChange={(e) => setFilterBookType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Types</option>
                                <option value="OLD">OLD</option>
                                <option value="NEW">NEW</option>
                            </select>
                        </div>
                        <div>
                            <Label>Operator Code</Label>
                            <Input
                                type="text"
                                value={filterOperatorCode}
                                onChange={(e) => setFilterOperatorCode(e.target.value)}
                                placeholder="Operator Code"
                            />
                        </div>
                        <div>
                            <Label>Parent Agent</Label>
                            <Input
                                type="text"
                                value={filterParentAgent}
                                onChange={(e) => setFilterParentAgent(e.target.value)}
                                placeholder="Parent Agent"
                            />
                        </div>
                        <div>
                            <Label>Receipt Number</Label>
                            <Input
                                type="text"
                                value={filterReceiptNumber}
                                onChange={(e) => setFilterReceiptNumber(e.target.value)}
                                placeholder="Receipt number"
                            />
                        </div>
                    </div>
                </div>

                {filteredEntries.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">
                            {entries.length === 0
                                ? "No entries found. Start by adding a new entry."
                                : "No entries match the applied filters."}
                        </p>
                        {entries.length === 0 && (
                            <button
                                onClick={() => navigate("/operator-dashboard/add-new-entry")}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add New Entry
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-300 dark:border-gray-600">
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Book #
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Operator Code
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Parent Agent
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Receipts
                                    </th>
                                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEntries.map((entry, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                            {entry.bookNumber}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                                            <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {entry.bookType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                                            {entry.operatorCode}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                                            {entry.parentAgentNumber}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                            {entry.receipts.map((receipt) => receipt.receiptNumber).join(", ")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        const actualIndex = entries.findIndex(e => e.bookNumber === entry.bookNumber);
                                                        // Link to the specific receipt (e.g., the first one in the book)
                                                        navigate(`/operator-dashboard/edit-receipt/${actualIndex}/${entry.receipts[0].id}`);
                                                    }}
                                                    className="rounded bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200"
                                                    title="Edit First Receipt"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entries.indexOf(entry))}
                                                    className="rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                    title="Delete"
                                                >
                                                    <TrashBinIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
