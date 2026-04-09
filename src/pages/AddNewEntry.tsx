import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import { ChevronDownIcon, PlusIcon } from "../icons";
import { handleNumberKeyDown, handleNumberPaste } from "../utils/formHelpers";

interface ToggleField {
  name: string;
  value: boolean;
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

export default function AddNewEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EntryData>({
    operatorCode: "",
    bookNumber: "",
    parentAgentNumber: "",
    bookType: "NEW",
    toggles: {
      startSame: false,
      okUptoSame: false,
      languageSame: false,
      moneySame: false,
      agentSame: false,
      renewalSame: false,
    },
    receipts: [],
  });

  // Error states
  const [errors, setErrors] = useState({
    operatorCode: "",
    bookNumber: "",
    parentAgentNumber: "",
  });

  const handleInitialChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (value.trim() && errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleToggleChange = (toggleName: keyof typeof formData.toggles) => {
    setFormData((prev) => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [toggleName]: !prev.toggles[toggleName],
      },
    }));
  };

  const handleExit = () => {
    navigate("/operator-dashboard/tax-entry");
  };

  const handleAddReceipt = () => {
    const newErrors = {
      operatorCode: "",
      bookNumber: "",
      parentAgentNumber: "",
    };

    if (!formData.operatorCode.trim()) {
      newErrors.operatorCode = "Operator code is required";
    }
    if (!formData.bookNumber.trim()) {
      newErrors.bookNumber = "Book number is required";
    }
    if (!formData.parentAgentNumber.trim()) {
      newErrors.parentAgentNumber = "Parent agent number is required";
    }

    if (newErrors.operatorCode || newErrors.bookNumber || newErrors.parentAgentNumber) {
      setErrors(newErrors);
      return;
    }

    // Navigate to add receipt page with entry data
    navigate("/operator-dashboard/add-receipt", { state: { entryData: formData } });
  };

  return (
    <>
      <PageMeta
        title="Add New Entry"
        description="Add new tax entry"
      />
      <PageBreadcrumb pageTitle="Add New Entry" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Entry Details Form */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
            Entry Details
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <Label>Operator Code</Label>
              <Input
                name="operatorCode"
                value={formData.operatorCode}
                onChange={handleInitialChange}
                onKeyDown={handleNumberKeyDown} // Strictly blocks characters while typing
                onPaste={handleNumberPaste}     // Blocks pasting non-numeric strings
                inputMode="numeric"
                placeholder="Enter operator code"
                className={errors.operatorCode ? "border-red-500" : ""}
              />
              {errors.operatorCode && (
                <p className="mt-1 text-sm text-red-500">{errors.operatorCode}</p>
              )}
            </div>
            <div>
              <Label>Book Number</Label>
              <Input
                name="bookNumber"
                value={formData.bookNumber}
                onChange={handleInitialChange}
                onKeyDown={handleNumberKeyDown} // Strictly blocks characters while typing
                onPaste={handleNumberPaste}     // Blocks pasting non-numeric strings
                inputMode="numeric"             // Opens number pad on mobile
                placeholder="Enter book number"
                className={errors.bookNumber ? "border-red-500" : ""}
              />
              {errors.bookNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.bookNumber}</p>
              )}
            </div>
            <div>
              <Label>Parent Agent Number</Label>
              <Input
                name="parentAgentNumber"
                value={formData.parentAgentNumber}
                onChange={handleInitialChange}
                onKeyDown={handleNumberKeyDown} // Strictly blocks characters while typing
                onPaste={handleNumberPaste}     // Blocks pasting non-numeric strings
                inputMode="numeric"             // Opens number pad on mobile
                placeholder="Enter parent agent number"
                className={errors.parentAgentNumber ? "border-red-500" : ""}
              />
              {errors.parentAgentNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.parentAgentNumber}</p>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              Settings
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                { key: "startSame", label: "Start same for whole book?" },
                { key: "okUptoSame", label: "Ok Upto same for whole book?" },
                { key: "languageSame", label: "Language same for whole book?" },
                { key: "moneySame", label: "Money same for whole book?" },
                { key: "agentSame", label: "Agent same for whole book?" },
                { key: "renewalSame", label: "Renewal same for whole book?" },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleToggleChange(
                        toggle.key as keyof typeof formData.toggles
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.toggles[
                        toggle.key as keyof typeof formData.toggles
                      ]
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.toggles[
                          toggle.key as keyof typeof formData.toggles
                        ]
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {toggle.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Book Type */}
          <div className="mt-6">
            <Label>Book Type</Label>
            <select
              name="bookType"
              value={formData.bookType}
              onChange={handleInitialChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white md:w-64"
            >
              <option value="NEW">NEW</option>
              <option value="OLD">OLD</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleExit}
            className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition hover:bg-red-600"
          >
            Exit
          </button>
          <button
            onClick={handleAddReceipt}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition hover:bg-green-600"
          >
            <PlusIcon className="h-5 w-5" />
            Add Receipt
          </button>
        </div>
      </div>
    </>
  );
}
