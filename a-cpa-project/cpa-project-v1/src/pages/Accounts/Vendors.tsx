import { useState, useEffect, useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { PencilIcon, PlusIcon, ArrowUpIcon, DownloadIcon } from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { vendorsApi, type Vendor } from "../../lib/api";

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
  });
  const [formErrors, setFormErrors] = useState<{ vendorId?: string; vendorName?: string }>({});

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch vendors on mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorsApi.getAll();
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingId(null);
    setFormData({ vendorId: "", vendorName: "" });
    setFormErrors({});
  };

  const handleEditClick = (vendor: Vendor) => {
    setIsModalOpen(true);
    setEditingId(vendor.id);
    setFormData({
      vendorId: vendor.vendorId,
      vendorName: vendor.vendorName,
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ vendorId: "", vendorName: "" });
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { vendorId?: string; vendorName?: string } = {};
    if (!formData.vendorId.trim()) {
      newErrors.vendorId = "Vendor ID is required";
    }
    if (!formData.vendorName.trim()) {
      newErrors.vendorName = "Vendor Name is required";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingId !== null) {
        await vendorsApi.update(editingId, {
          vendorId: formData.vendorId,
          vendorName: formData.vendorName,
        });
      } else {
        await vendorsApi.create({
          vendorId: formData.vendorId,
          vendorName: formData.vendorName,
        });
      }
      handleCloseModal();
      fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (editingId === null) return;

    setSubmitting(true);
    try {
      await vendorsApi.delete(editingId);
      handleCloseModal();
      fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vendor');
    } finally {
      setSubmitting(false);
    }
  };

  // Upload modal handlers
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadFile(null);
    setUploadError(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadError(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setUploadError('Please upload a CSV or Excel file');
      return;
    }
    setUploadFile(file);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      const text = await uploadFile.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        throw new Error('File must contain headers and at least one data row');
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const vendorIdIndex = headers.findIndex(h => h === 'vendor id' || h === 'vendorid');
      const vendorNameIndex = headers.findIndex(h => h === 'vendor name' || h === 'vendorname');

      if (vendorIdIndex === -1 || vendorNameIndex === -1) {
        throw new Error('File must contain "Vendor ID" and "Vendor Name" columns');
      }

      // Parse data rows and create vendors
      const newVendors: { vendorId: string; vendorName: string }[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const vendorId = values[vendorIdIndex];
        const vendorName = values[vendorNameIndex];

        if (vendorId && vendorName) {
          newVendors.push({ vendorId, vendorName });
        }
      }

      if (newVendors.length === 0) {
        throw new Error('No valid vendor data found in file');
      }

      // Create vendors one by one
      for (const vendor of newVendors) {
        await vendorsApi.create(vendor);
      }

      handleCloseUploadModal();
      fetchVendors();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Export functions
  const exportTemplate = () => {
    const headers = 'Vendor ID,Vendor Name';
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportData = () => {
    const headers = 'Vendor ID,Vendor Name';
    const rows = vendors.map(v => `"${v.vendorId}","${v.vendorName}"`);
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendors_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageMeta
        title="Vendors | CPA Dashboard"
        description="Manage your vendors"
      />
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Vendors" />
        <div className="flex gap-3">
          <Button
            size="md"
            variant="outline"
            startIcon={<ArrowUpIcon className="w-5 h-5 fill-current" />}
            onClick={handleOpenUploadModal}
          >
            Upload
          </Button>
          <Button
            size="md"
            startIcon={<PlusIcon className="w-5 h-5 fill-current" />}
            onClick={handleOpenModal}
          >
            Add Vendor
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading vendors...</div>
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Vendor ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Vendor Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400 w-24"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {vendors.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={3}>
                      No vendors found. Click "Add Vendor" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 font-mono">
                        {vendor.vendorId}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                        {vendor.vendorName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end w-24">
                        <button
                          onClick={() => handleEditClick(vendor)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                          <PencilIcon className="w-4 h-4 fill-current" />
                          Edit
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add/Edit Vendor Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-md p-6 mx-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {editingId !== null ? "Edit Vendor" : "Add New Vendor"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendorId">Vendor ID</Label>
              <Input
                id="vendorId"
                name="vendorId"
                type="text"
                placeholder="e.g., V-008"
                value={formData.vendorId}
                onChange={handleInputChange}
                error={!!formErrors.vendorId}
                hint={formErrors.vendorId}
              />
            </div>
            <div>
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                id="vendorName"
                name="vendorName"
                type="text"
                placeholder="Enter vendor name"
                value={formData.vendorName}
                onChange={handleInputChange}
                error={!!formErrors.vendorName}
                hint={formErrors.vendorName}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              {editingId !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  {submitting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId !== null ? "Save Changes" : "Add Vendor"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} className="max-w-lg p-6 mx-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Upload Vendors
        </h2>

        {/* Export Options */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Download a file to get started:
          </p>
          <div className="flex gap-3">
            <button
              onClick={exportTemplate}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20"
            >
              <DownloadIcon className="w-4 h-4 fill-current" />
              Blank Template
            </button>
            <button
              onClick={exportData}
              disabled={vendors.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-4 h-4 fill-current" />
              Export Data ({vendors.length})
            </button>
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <ArrowUpIcon className="w-10 h-10 mx-auto mb-3 fill-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {uploadFile ? uploadFile.name : 'Drop your file here, or click to browse'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supports CSV and Excel files
          </p>
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {uploadError}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCloseUploadModal} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!uploadFile || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
