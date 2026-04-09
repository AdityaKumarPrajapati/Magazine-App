import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import DatePicker from "../components/form/DatePicker";
import { ChevronDownIcon, PlusIcon } from "../icons";
import { handleNumberKeyDown, handleNumberPaste } from "../utils/formHelpers";
import { useFormMacro } from "../utils/hooks/useFormMacro";

interface MemberDetails {
    customerNumber: string;
    date: string;
    agentNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface AddressDetails {
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
}

interface ReceiptEntry {
    id: string;
    receiptNumber: string;
    memberDetails: MemberDetails;
    addressDetails: AddressDetails;
    amount: string;
}

interface EntryData {
    operatorCode: string;
    bookNumber: string;
    parentAgentNumber: string;
    bookType: string;
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

const AddReceipt: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [entryData, setEntryData] = useState<EntryData | null>(null);
    const [currentReceipt, setCurrentReceipt] = useState<ReceiptEntry>({
        id: "",
        receiptNumber: "",
        memberDetails: {
            customerNumber: "",
            date: "",
            agentNumber: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        },
        addressDetails: {
            address1: "",
            address2: "",
            address3: "",
            pinCode: "",
            state: "",
            district: "",
            city: "",
            post: "",
            via: "",
            taluka: "",
            startIssue: "",
        },
        amount: "",
    });

    const [expandedSections, setExpandedSections] = useState({
        receipt: true,
        members: true,
        address: true,
        amount: true,
    });

    const {
        isRecording,
        showMacroPopup,
        setShowMacroPopup,
        startRecording,
        stopAndSaveMacro,
        applyMacroByName,
        recordField
    } = useFormMacro(setCurrentReceipt, {
        "member_": "memberDetails",
        "address_": "addressDetails"
    });

    const [allExpanded, setAllExpanded] = useState(true);
    const [receiptNumberError, setReceiptNumberError] = useState("");
    const [totalReceiptCount, setTotalReceiptCount] = useState(0);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showMacroList, setShowMacroList] = useState(false);

    // Error states for all fields
    const [errors, setErrors] = useState({
        receiptNumber: "",
        member_firstName: "",
        member_lastName: "",
        member_phoneNumber: "",
        address_city: "",
        amount: "",
    });

    useEffect(() => {
        // Get entry data from location state
        if (location.state && location.state.entryData) {
            const entry = location.state.entryData;
            setEntryData(entry);

            // Calculate total receipts across all entries with same book number
            const allEntries = JSON.parse(localStorage.getItem("taxEntries") || "[]") as EntryData[];
            const sameBookEntries = allEntries.filter(e => e.bookNumber === entry.bookNumber);
            const total = sameBookEntries.reduce((sum, e) => sum + e.receipts.length, 0);
            setTotalReceiptCount(total);
        } else {
            // Redirect to tax entry if no entry data
            alert("No entry data found. Redirecting to tax entry.");
            navigate("/operator-dashboard/tax-entry");
        }
    }, [location, navigate]);

    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {

            if (e.altKey && e.key.toLowerCase() === 'a') {

                e.preventDefault();

                processSave(true);

            }

            if (e.ctrlKey && e.key.toLowerCase() === 's') {

                e.preventDefault();

                processSave(false);

            }

            if (e.key === 'Escape') {

                setShowShortcuts(false);

            }

        };



        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [currentReceipt, entryData]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // F10 to Start Recording
            if (e.key === "F10") {
                e.preventDefault();
                setShowMacroPopup(true);
            }
            // F6 to Stop and Save
            if (e.key === "F6") {
                e.preventDefault();
                stopAndSaveMacro();
            }
            // Ctrl + 4 to choose a macro to apply
            if (e.ctrlKey && e.key === "4") {
                e.preventDefault();
                setShowMacroList(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [stopAndSaveMacro]);

    const handleReceiptChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Safety check: Even with onKeyDown, let's prevent non-numeric input 
        // for fields meant to be numeric (except for select elements)
        const numericFields = [
            "receiptNumber",
            "member_customerNumber",
            "member_agentNumber",
            "member_phoneNumber",
            "address_pinCode",
            "amount"
        ];

        if (numericFields.includes(name) && value !== "" && !/^\d+$/.test(value)) {
            return;
        }
        if (name.startsWith("member_")) {
            const field = name.replace("member_", "");
            setCurrentReceipt((prev) => ({
                ...prev,
                memberDetails: {
                    ...prev.memberDetails,
                    [field]: value,
                },
            }));
        } else if (name.startsWith("address_")) {
            const field = name.replace("address_", "");
            setCurrentReceipt((prev) => ({
                ...prev,
                addressDetails: {
                    ...prev.addressDetails,
                    [field]: value,
                },
            }));
        } else {
            setCurrentReceipt((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error for this field when user starts typing
        if (value.trim() && errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
        recordField(name, value);
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleAllSections = () => {
        const newState = !allExpanded;
        setExpandedSections({
            receipt: newState,
            members: newState,
            address: newState,
            amount: newState,
        });
        setAllExpanded(newState);
    };

    const processSave = (isAddingAnother: boolean) => {
        const newErrors = {
            receiptNumber: "",
            member_firstName: "",
            member_lastName: "",
            member_phoneNumber: "",
            address_city: "",
            amount: "",
        };

        if (!entryData) return;

        // 1. Fetch current storage to check against ALL receipts for this book
        const existingData = JSON.parse(localStorage.getItem("taxEntries") || "[]") as EntryData[];

        // Find all receipts already saved under this Book Number
        const sameBookReceipts = existingData
            .filter(entry => entry.bookNumber === entryData.bookNumber)
            .flatMap(entry => entry.receipts);

        // 2. Validation: Unique Receipt Number
        if (!currentReceipt.receiptNumber.trim()) {
            newErrors.receiptNumber = "Receipt number is required";
        } else {
            const isDuplicate = sameBookReceipts.some(
                (r) => r.receiptNumber === currentReceipt.receiptNumber
            );
            if (isDuplicate) {
                newErrors.receiptNumber = `Receipt #${currentReceipt.receiptNumber} already exists in this book`;
                setErrors(newErrors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        // 3. Validation: Max 25 per book
        if (sameBookReceipts.length >= 25) {
            alert("This book has reached the maximum limit of 25 receipts.");
            return;
        }

        // 4. Standard Field Validations
        if (!currentReceipt.memberDetails.firstName.trim()) newErrors.member_firstName = "Required";
        if (!currentReceipt.memberDetails.lastName.trim()) newErrors.member_lastName = "Required";
        if (currentReceipt.memberDetails.phoneNumber.length !== 10) newErrors.member_phoneNumber = "Must be 10 digits";
        if (!currentReceipt.amount.trim()) newErrors.amount = "Required";

        if (Object.values(newErrors).some(err => err !== "")) {
            setErrors(newErrors);
            return;
        }

        // 5. Save Logic: Update existing entry or push new one
        const newReceipt = { ...currentReceipt, id: `rcpt_${Date.now()}` };
        const bookIndex = existingData.findIndex(e => e.bookNumber === entryData.bookNumber);

        if (bookIndex > -1) {
            existingData[bookIndex].receipts.push(newReceipt);
        } else {
            existingData.push({ ...entryData, receipts: [newReceipt] });
        }

        localStorage.setItem("taxEntries", JSON.stringify(existingData));

        // 6. Navigation / UI Reset
        if (isAddingAnother) {
            // Update local count for the UI display
            setTotalReceiptCount(sameBookReceipts.length + 1);

            // Clear the form for the next receipt
            setCurrentReceipt({
                id: "",
                receiptNumber: "",
                memberDetails: { customerNumber: "", date: "", agentNumber: "", firstName: "", lastName: "", phoneNumber: "" },
                addressDetails: { address1: "", address2: "", address3: "", pinCode: "", state: "", district: "", city: "", post: "", via: "", taluka: "", startIssue: "" },
                amount: ""
            });

            // Reset toggles (Keeping sections expanded as per user preference)
            setExpandedSections({ receipt: true, members: true, address: false, amount: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Finish and go back
            navigate("/operator-dashboard/tax-entry");
        }
    };

    const handleBack = () => {
        navigate("/operator-dashboard/tax-entry");
    };

    const handleAddAnotherReceipt = () => {
        // Clear current receipt but keep the form for adding another
        setCurrentReceipt({
            id: "",
            receiptNumber: "",
            memberDetails: {
                customerNumber: "",
                date: "",
                agentNumber: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
            },
            addressDetails: {
                address1: "",
                address2: "",
                address3: "",
                pinCode: "",
                state: "",
                district: "",
                city: "",
                post: "",
                via: "",
                taluka: "",
                startIssue: "",
            },
            amount: "",
        });

        // Collapse all sections and scroll to top
        setExpandedSections({
            receipt: true,
            members: false,
            address: false,
            amount: false,
        });
        window.scrollTo(0, 0);
    };

    if (!entryData) {
        return (
            <>
                <PageMeta
                    title="Add Receipt"
                    description="Add receipt to entry"
                />
                <PageBreadcrumb pageTitle="Add Receipt" />
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <p className="text-center text-gray-600 dark:text-gray-400">
                        Loading...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta
                title="Add Receipt"
                description="Add receipt to entry"
            />
            <PageBreadcrumb pageTitle="Add Receipt" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {/* Entry Info Bar */}
                <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 md:flex-row md:items-center">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                                OPERATOR CODE:
                            </span>
                            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                                {entryData.operatorCode || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                                BOOK NUMBER:
                            </span>
                            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                                {entryData.bookNumber || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                                RECEIPT ENTRY:
                            </span>
                            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                                {totalReceiptCount + 1} of 25
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                                RECEIPT NUMBER:
                            </span>
                            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                                {currentReceipt.receiptNumber || "-"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={toggleAllSections}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
                    >
                        <ChevronDownIcon
                            className={`h-5 w-5 transition-transform ${allExpanded ? "rotate-180" : ""
                                }`}
                        />
                        {allExpanded ? "Collapse All" : "Expand All"}
                    </button>
                </div>

                {/* Receipt Form Sections */}
                <div className="space-y-4">
                    {/* Receipt Number Section */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection("receipt")}
                            className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                📋 Receipt Number
                            </h4>
                            <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${expandedSections.receipt ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSections.receipt && (
                            <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                                <div>
                                    <Label>Enter Receipt Number</Label>
                                    <Input
                                        name="receiptNumber"
                                        value={currentReceipt.receiptNumber}
                                        onChange={handleReceiptChange}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handleNumberPaste}
                                        inputMode="numeric"
                                        placeholder="Enter receipt number"
                                        className={errors.receiptNumber ? "border-red-500" : ""}
                                    />
                                    {errors.receiptNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.receiptNumber}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Member Details Section */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection("members")}
                            className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                👤 Member Details
                            </h4>
                            <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${expandedSections.members ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSections.members && (
                            <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <Label>Customer Number</Label>
                                        <Input
                                            name="member_customerNumber"
                                            value={currentReceipt.memberDetails.customerNumber}
                                            onChange={handleReceiptChange}
                                            onKeyDown={handleNumberKeyDown}
                                            onPaste={handleNumberPaste}
                                            inputMode="numeric"
                                            placeholder="Enter customer number"
                                        />
                                    </div>
                                    <div>
                                        <Label>Date</Label>
                                        <DatePicker
                                            name="member_date"
                                            value={currentReceipt.memberDetails.date}
                                            onChange={(value) => {
                                                setCurrentReceipt((prev) => ({
                                                    ...prev,
                                                    memberDetails: {
                                                        ...prev.memberDetails,
                                                        date: value,
                                                    },
                                                }));
                                            }}
                                            placeholder="Select date"
                                        />
                                    </div>
                                    <div>
                                        <Label>Agent Number</Label>
                                        <Input
                                            name="member_agentNumber"
                                            value={currentReceipt.memberDetails.agentNumber}
                                            onChange={handleReceiptChange}
                                            onKeyDown={handleNumberKeyDown}
                                            onPaste={handleNumberPaste}
                                            inputMode="numeric"
                                            placeholder="Enter agent number"
                                        />
                                    </div>
                                    <div>
                                        <Label>First Name</Label>
                                        <Input
                                            name="member_firstName"
                                            value={currentReceipt.memberDetails.firstName}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter first name"
                                            className={errors.member_firstName ? "border-red-500" : ""}
                                        />
                                        {errors.member_firstName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.member_firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Last Name</Label>
                                        <Input
                                            name="member_lastName"
                                            value={currentReceipt.memberDetails.lastName}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter last name"
                                            className={errors.member_lastName ? "border-red-500" : ""}
                                        />
                                        {errors.member_lastName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.member_lastName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Phone Number</Label>
                                        <Input
                                            name="member_phoneNumber"
                                            value={currentReceipt.memberDetails.phoneNumber}
                                            onChange={handleReceiptChange}
                                            onKeyDown={(e) => handleNumberKeyDown(e, 10)}
                                            onPaste={handleNumberPaste}
                                            maxLength={10}
                                            inputMode="numeric"
                                            placeholder="Enter 10 digit phone number"
                                            className={errors.member_phoneNumber ? "border-red-500" : ""}
                                        />
                                        {errors.member_phoneNumber && (
                                            <p className="mt-1 text-sm text-red-500">{errors.member_phoneNumber}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address Details Section */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection("address")}
                            className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                📍 Address Details
                            </h4>
                            <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${expandedSections.address ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSections.address && (
                            <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <Label>Address 1</Label>
                                        <Input
                                            name="address_address1"
                                            value={currentReceipt.addressDetails.address1}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter address line 1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Pin Code</Label>
                                        <Input
                                            name="address_pinCode"
                                            value={currentReceipt.addressDetails.pinCode}
                                            onChange={handleReceiptChange}
                                            onKeyDown={(e) => handleNumberKeyDown(e, 6)}
                                            maxLength={6}
                                            onPaste={handleNumberPaste}
                                            inputMode="numeric"
                                            placeholder="Enter pin code"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label>Address 2</Label>
                                        <Input
                                            name="address_address2"
                                            value={currentReceipt.addressDetails.address2}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter address line 2"
                                        />
                                    </div>
                                    <div>
                                        <Label>State</Label>
                                        <Input
                                            name="address_state"
                                            value={currentReceipt.addressDetails.state}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter state"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label>Address 3</Label>
                                        <Input
                                            name="address_address3"
                                            value={currentReceipt.addressDetails.address3}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter address line 3"
                                        />
                                    </div>
                                    <div>
                                        <Label>District</Label>
                                        <Input
                                            name="address_district"
                                            value={currentReceipt.addressDetails.district}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter district"
                                        />
                                    </div>
                                    <div>
                                        <Label>City</Label>
                                        <Input
                                            name="address_city"
                                            value={currentReceipt.addressDetails.city}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter city"
                                            className={errors.address_city ? "border-red-500" : ""}
                                        />
                                        {errors.address_city && (
                                            <p className="mt-1 text-sm text-red-500">{errors.address_city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Post</Label>
                                        <Input
                                            name="address_post"
                                            value={currentReceipt.addressDetails.post}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter post"
                                        />
                                    </div>
                                    <div>
                                        <Label>Via</Label>
                                        <Input
                                            name="address_via"
                                            value={currentReceipt.addressDetails.via}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter via"
                                        />
                                    </div>
                                    <div>
                                        <Label>Taluka</Label>
                                        <Input
                                            name="address_taluka"
                                            value={currentReceipt.addressDetails.taluka}
                                            onChange={handleReceiptChange}
                                            placeholder="Enter taluka"
                                        />
                                    </div>
                                    <div>
                                        <Label>Start Issue</Label>
                                        <DatePicker
                                            name="address_startIssue"
                                            value={currentReceipt.addressDetails.startIssue}
                                            onChange={(value) => {
                                                setCurrentReceipt((prev) => ({
                                                    ...prev,
                                                    addressDetails: {
                                                        ...prev.addressDetails,
                                                        startIssue: value,
                                                    },
                                                }));
                                            }}
                                            placeholder="Select date"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Amount Section */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => toggleSection("amount")}
                            className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800"
                        >
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                💰 Amount
                            </h4>
                            <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${expandedSections.amount ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSections.amount && (
                            <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                                <div>
                                    <Label>Enter Amount</Label>
                                    <Input
                                        name="amount"
                                        type="number"
                                        value={currentReceipt.amount}
                                        onChange={handleReceiptChange}
                                        onKeyDown={handleNumberKeyDown}
                                        onPaste={handleNumberPaste}
                                        prefix="₹"
                                        inputMode="numeric"
                                        placeholder="Enter amount"
                                        className={errors.amount ? "border-red-500" : ""}
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <div className="flex gap-3">
                        <button onClick={handleBack} className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">Back</button>
                        <button onClick={() => setShowShortcuts(true)} className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-600 dark:text-gray-300">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-700">⌘</span>

                        </button>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        {/* Adds to storage AND stays on page */}
                        <button
                            onClick={() => processSave(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <PlusIcon />
                            Add Another Receipt
                        </button>

                        {/* Adds to storage AND redirects */}
                        <button
                            onClick={() => processSave(false)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600 shadow-lg"
                        >
                            Save & Finish
                        </button>
                    </div>
                </div>
            </div>

            {showShortcuts && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
                    <div className="relative w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">⌨️ Keyboard Shortcuts</h3>
                            <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Save & Add Another</span>
                                <div className="flex gap-1">
                                    <kbd className="min-w-[32px] rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-xs font-bold dark:bg-gray-800">Alt</kbd>
                                    <kbd className="min-w-[24px] rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-xs font-bold dark:bg-gray-800">A</kbd>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Save & Finish Book</span>
                                <div className="flex gap-1">
                                    <kbd className="min-w-[32px] rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-xs font-bold dark:bg-gray-800">Ctrl</kbd>
                                    <kbd className="min-w-[24px] rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-xs font-bold dark:bg-gray-800">S</kbd>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Close Popup</span>
                                <kbd className="min-w-[32px] rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-xs font-bold dark:bg-gray-800">Esc</kbd>
                            </div>
                        </div>
                        <button onClick={() => setShowShortcuts(false)} className="mt-8 w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95">Got it</button>
                    </div>
                </div>,
                document.body
            )}

            {/* {isRecording && (
                <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-white shadow-lg animate-pulse z-[60]">
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                    <span className="text-sm font-bold">Recording Macro (F11 to stop)</span>
                </div>
            )} */}

            {/* NAME MACRO POPUP (As per your screenshot) */}
            {showMacroPopup && createPortal(
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowMacroPopup(false)} />
                    <div className="relative w-full max-w-md transform rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Name Macro</h2>
                        <input
                            autoFocus
                            id="macro-name-input"
                            type="text"
                            placeholder="Macro name"
                            className="w-full rounded-lg border-2 border-blue-500 bg-transparent px-4 py-3 text-lg outline-none dark:text-white mb-8"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') startRecording(e.currentTarget.value);
                            }}
                        />
                        <div className="flex justify-end gap-6">
                            <button onClick={() => setShowMacroPopup(false)} className="text-lg font-semibold text-gray-500">Cancel</button>
                            <button
                                onClick={() => startRecording((document.getElementById('macro-name-input') as HTMLInputElement).value)}
                                className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {/* SELECT MACRO TO APPLY POPUP (Ctrl + 4) */}
            {showMacroList && createPortal(
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowMacroList(false)} />
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Select Macro to Apply</h2>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {Object.keys(JSON.parse(localStorage.getItem("app_macros") || "{}")).map((name) => (
                                <button
                                    key={name}
                                    onClick={() => {
                                        applyMacroByName(name);
                                        setShowMacroList(false);
                                    }}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white transition-colors"
                                >
                                    🚀 {name}
                                </button>
                            ))}
                            {Object.keys(JSON.parse(localStorage.getItem("app_macros") || "{}")).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No macros saved yet.</p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowMacroList(false)}
                            className="mt-4 w-full py-2 text-gray-500 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* RECORDING STATUS INDICATOR */}
            {isRecording && (
                <div className="fixed bottom-6 left-6 flex items-center gap-3 rounded-full bg-red-600 px-6 py-3 text-white shadow-2xl animate-pulse z-[50]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span className="font-bold uppercase tracking-wider text-sm">Recording Mode (F6 to Save)</span>
                </div>
            )}
        </>
    );
};

export default AddReceipt;
