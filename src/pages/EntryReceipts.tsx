import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { TrashBinIcon, PencilIcon } from "../icons";

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

export default function EntryReceipts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState<EntryData | null>(null);
  const [entryIndex, setEntryIndex] = useState<number | null>(null);
  const [receipts, setReceipts] = useState<ReceiptEntry[]>([]);

  useEffect(() => {
    if (location.state?.entryData && location.state?.entryIndex !== undefined) {
      setEntryData(location.state.entryData);
      setEntryIndex(location.state.entryIndex);
      setReceipts(location.state.entryData.receipts);
    } else {
      navigate("/operator-dashboard/view-tax-list");
    }
  }, [location, navigate]);

  const handleDeleteReceipt = (receiptIndex: number) => {
    if (window.confirm("Are you sure you want to delete this receipt?")) {
      const existingData = localStorage.getItem("taxEntries");
      const allEntries: EntryData[] = existingData ? JSON.parse(existingData) : [];

      if (entryIndex !== null && allEntries[entryIndex]) {
        allEntries[entryIndex].receipts = allEntries[entryIndex].receipts.filter(
          (_, i) => i !== receiptIndex
        );
        localStorage.setItem("taxEntries", JSON.stringify(allEntries));
        setReceipts(allEntries[entryIndex].receipts);
        setEntryData(allEntries[entryIndex]);
      }
    }
  };

  if (!entryData) {
    return (
      <>
        <PageMeta
          title="Entry Receipts"
          description="View entry receipts"
        />
        <PageBreadcrumb pageTitle="Entry Receipts" />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Entry Receipts"
        description="View entry receipts"
      />
      <PageBreadcrumb pageTitle="Entry Receipts" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Entry Info Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 md:flex-row md:items-center">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                BOOK TYPE:
              </span>
              <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                {entryData.bookType || "-"}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/operator-dashboard/view-tax-list")}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Back
          </button>
        </div>

        {/* Receipts Table */}
        {receipts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Receipt #
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Customer Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    City
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, receiptIndex) => (
                  <tr
                    key={receiptIndex}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {receipt.receiptNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {receipt.memberDetails.firstName} {receipt.memberDetails.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {receipt.memberDetails.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
                      ₹{receipt.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {receipt.addressDetails.city}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigate("/operator-dashboard/edit-receipt", {
                            state: {
                              entryData: entryData,
                              entryIndex: entryIndex,
                              receipt: receipt,
                              receiptIndex: receiptIndex,
                            },
                          })}
                          className="rounded bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReceipt(receiptIndex)}
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
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No receipts added for this entry yet
            </p>
          </div>
        )}
      </div>
    </>
  );
}
