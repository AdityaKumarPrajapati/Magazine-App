import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import DatePicker from "../components/form/DatePicker";
import { ChevronDownIcon } from "../icons";

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
  toggles: any;
  receipts: ReceiptEntry[];
}

const EditReceipt: React.FC = () => {
  const { entryIndex, receiptId } = useParams<{ entryIndex: string; receiptId: string }>();
  const navigate = useNavigate();

  const [entryData, setEntryData] = useState<EntryData | null>(null);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptEntry | null>(null);
  const [receiptIndexInArray, setReceiptIndexInArray] = useState<number | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    receipt: true,
    members: true,
    address: true,
    amount: true,
  });

  const [allExpanded, setAllExpanded] = useState(true);

  const [errors, setErrors] = useState({
    receiptNumber: "",
    member_firstName: "",
    member_lastName: "",
    member_phoneNumber: "",
    address_city: "",
    amount: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("taxEntries");
    if (!data) {
      navigate("/operator-dashboard/view-tax-list");
      return;
    }

    const allEntries: EntryData[] = JSON.parse(data);
    const parentEntry = allEntries[Number(entryIndex)];

    if (parentEntry) {
      const rIdx = parentEntry.receipts.findIndex((r) => r.id === receiptId);
      if (rIdx !== -1) {
        setEntryData(parentEntry);
        setCurrentReceipt(parentEntry.receipts[rIdx]);
        setReceiptIndexInArray(rIdx);
      } else {
        navigate("/operator-dashboard/view-tax-list");
      }
    } else {
      navigate("/operator-dashboard/view-tax-list");
    }
  }, [entryIndex, receiptId, navigate]);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentReceipt) return;
    const { name, value } = e.target;

    if (name.startsWith("member_")) {
      const field = name.replace("member_", "");
      setCurrentReceipt((prev) => ({
        ...prev!,
        memberDetails: { ...prev!.memberDetails, [field]: value },
      }));
    } else if (name.startsWith("address_")) {
      const field = name.replace("address_", "");
      setCurrentReceipt((prev) => ({
        ...prev!,
        addressDetails: { ...prev!.addressDetails, [field]: value },
      }));
    } else {
      setCurrentReceipt((prev) => ({ ...prev!, [name]: value }));
    }
  };

  const handleSaveReceipt = () => {
    if (!currentReceipt || receiptIndexInArray === null || entryIndex === undefined) return;

    const data = localStorage.getItem("taxEntries");
    const allEntries: EntryData[] = data ? JSON.parse(data) : [];

    if (allEntries[Number(entryIndex)]) {
      allEntries[Number(entryIndex)].receipts[receiptIndexInArray] = currentReceipt;
      localStorage.setItem("taxEntries", JSON.stringify(allEntries));
      navigate("/operator-dashboard/view-tax-list");
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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

  if (!currentReceipt || !entryData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <PageMeta title="Edit Receipt" description="Edit receipt" />
      <PageBreadcrumb pageTitle="Edit Receipt" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Entry Info Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 md:flex-row md:items-center">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <span className="font-medium text-gray-500">OPERATOR CODE:</span>
              <span className="ml-2 font-bold">{entryData.operatorCode}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500">BOOK NUMBER:</span>
              <span className="ml-2 font-bold">{entryData.bookNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-500">RECEIPT NUMBER:</span>
              <span className="ml-2 font-bold text-blue-600">{currentReceipt.receiptNumber}</span>
            </div>
          </div>
          <button
            onClick={toggleAllSections}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white"
          >
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${allExpanded ? "rotate-180" : ""}`} />
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Receipt Number Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => toggleSection("receipt")} className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="font-semibold">📋 Receipt Number</h4>
              <ChevronDownIcon className={`h-5 w-5 ${expandedSections.receipt ? "rotate-180" : ""}`} />
            </button>
            {expandedSections.receipt && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Label>Enter Receipt Number</Label>
                <Input name="receiptNumber" value={currentReceipt.receiptNumber} onChange={handleReceiptChange} />
              </div>
            )}
          </div>

          {/* Member Details Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => toggleSection("members")} className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="font-semibold">👤 Member Details</h4>
              <ChevronDownIcon className={`h-5 w-5 ${expandedSections.members ? "rotate-180" : ""}`} />
            </button>
            {expandedSections.members && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div><Label>Customer Number</Label><Input name="member_customerNumber" value={currentReceipt.memberDetails.customerNumber} onChange={handleReceiptChange} /></div>
                  <div>
                    <Label>Date</Label>
                    <DatePicker 
                        value={currentReceipt.memberDetails.date} 
                        onChange={(val) => setCurrentReceipt(prev => ({...prev!, memberDetails: {...prev!.memberDetails, date: val}}))} 
                    />
                  </div>
                  <div><Label>Agent Number</Label><Input name="member_agentNumber" value={currentReceipt.memberDetails.agentNumber} onChange={handleReceiptChange} /></div>
                  <div><Label>First Name</Label><Input name="member_firstName" value={currentReceipt.memberDetails.firstName} onChange={handleReceiptChange} /></div>
                  <div><Label>Last Name</Label><Input name="member_lastName" value={currentReceipt.memberDetails.lastName} onChange={handleReceiptChange} /></div>
                  <div><Label>Phone Number</Label><Input name="member_phoneNumber" value={currentReceipt.memberDetails.phoneNumber} onChange={handleReceiptChange} /></div>
                </div>
              </div>
            )}
          </div>

          {/* Address Details Section - ALL ORIGINAL FIELDS RESTORED */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => toggleSection("address")} className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="font-semibold">📍 Address Details</h4>
              <ChevronDownIcon className={`h-5 w-5 ${expandedSections.address ? "rotate-180" : ""}`} />
            </button>
            {expandedSections.address && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="md:col-span-2"><Label>Address 1</Label><Input name="address_address1" value={currentReceipt.addressDetails.address1} onChange={handleReceiptChange} /></div>
                  <div><Label>Pin Code</Label><Input name="address_pinCode" value={currentReceipt.addressDetails.pinCode} onChange={handleReceiptChange} /></div>
                  <div className="md:col-span-2"><Label>Address 2</Label><Input name="address_address2" value={currentReceipt.addressDetails.address2} onChange={handleReceiptChange} /></div>
                  <div><Label>State</Label><Input name="address_state" value={currentReceipt.addressDetails.state} onChange={handleReceiptChange} /></div>
                  <div className="md:col-span-2"><Label>Address 3</Label><Input name="address_address3" value={currentReceipt.addressDetails.address3} onChange={handleReceiptChange} /></div>
                  <div><Label>District</Label><Input name="address_district" value={currentReceipt.addressDetails.district} onChange={handleReceiptChange} /></div>
                  <div><Label>City</Label><Input name="address_city" value={currentReceipt.addressDetails.city} onChange={handleReceiptChange} /></div>
                  <div><Label>Post</Label><Input name="address_post" value={currentReceipt.addressDetails.post} onChange={handleReceiptChange} /></div>
                  <div><Label>Via</Label><Input name="address_via" value={currentReceipt.addressDetails.via} onChange={handleReceiptChange} /></div>
                  <div><Label>Taluka</Label><Input name="address_taluka" value={currentReceipt.addressDetails.taluka} onChange={handleReceiptChange} /></div>
                  <div>
                    <Label>Start Issue</Label>
                    <DatePicker 
                        value={currentReceipt.addressDetails.startIssue} 
                        onChange={(val) => setCurrentReceipt(prev => ({...prev!, addressDetails: {...prev!.addressDetails, startIssue: val}}))} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amount Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button onClick={() => toggleSection("amount")} className="flex w-full items-center justify-between bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="font-semibold">💰 Amount</h4>
              <ChevronDownIcon className={`h-5 w-5 ${expandedSections.amount ? "rotate-180" : ""}`} />
            </button>
            {expandedSections.amount && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Label>Enter Amount</Label>
                <Input name="amount" type="number" value={currentReceipt.amount} onChange={handleReceiptChange} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button onClick={() => navigate(-1)} className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium text-gray-700">Back</button>
          <button onClick={handleSaveReceipt} className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600">Save Changes</button>
        </div>
      </div>
    </>
  );
};

export default EditReceipt;