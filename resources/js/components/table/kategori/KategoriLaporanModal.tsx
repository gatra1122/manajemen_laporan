import React, { useEffect, useState } from "react";
import { KategoriLaporanType, SupplierType } from "../../../types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosClient from "../../../utils/axios";

interface formDataType {
    nama: string;
}

type BaseModalProps = {
    state: boolean;
    selectedData: KategoriLaporanType | null;
    onClose: () => void;
    formInputChange?: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
};

type DeleteModalProps = BaseModalProps & {
    type: "delete";
    formData?: null;
};

type CreateUpdateProps = BaseModalProps & {
    type: "create" | "update";
    formData: formDataType;
    formInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
};

type ModalProps = DeleteModalProps | CreateUpdateProps;

const KategoriLaporanModal = ({
    state,
    selectedData,
    formData,
    type,
    onClose,
    formInputChange,
}: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!state) {
            setErrorMsg(null);
        }
    }, [state]);

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/kategori_laporan`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "kategori_laporan",
            });
            setLoading(false);
            setErrorMsg(null);
            toast.success("Berhasil menambahkan data");
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage =
                error.response?.data?.message || "Terjadi kesalahan jaringan.";
            toast.error(`${errorMessage}`);
            setErrorMsg(error.response?.data?.errors);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.put(
                `/kategori_laporan/${selectedData!.id}`,
                formData,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "kategori_laporan",
            });
            setLoading(false);
            setErrorMsg(null);
            toast.success("Berhasil memperbarui data");
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage =
                error.response?.data?.message || "Terjadi kesalahan jaringan.";
            toast.error(`${errorMessage}`);
            setErrorMsg(error.response?.data?.errors);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.delete(
                `/kategori_laporan/${selectedData!.id}`,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "kategori_laporan",
            });
            setLoading(false);
            toast.success("Berhasil menghapus data");
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage =
                error.response?.data?.message || "Terjadi kesalahan jaringan.";
            console.error(errorMessage);
            toast.error(`${errorMessage}`);
        },
    });

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (type === "create") {
            postMutation.mutate();
        } else if (type === "update") {
            updateMutation.mutate();
        }
    };

    const submitDelete = () => {
        setLoading(true);
        if (type === "delete") {
            deleteMutation.mutate();
        }
    };

    return (
        <>
            <Dialog open={state} onClose={onClose} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    {type === "create" && "Tambah "}
                                    {type === "update" && "Ubah "}
                                    {type === "delete" && "Hapus "}
                                    Kategori Laporan
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {["create", "update", "read"].includes(
                                    type,
                                ) && (
                                    <form
                                        onSubmit={submitForm}
                                        className="space-y-4"
                                        id="Form"
                                    >
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="nama"
                                            >
                                                Nama Kategori Laporan*
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.nama}
                                                </span>
                                            )}
                                            <input
                                                name="nama"
                                                onChange={formInputChange}
                                                value={formData?.nama}
                                                type="text"
                                                id="nama"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nama kategori laporan..."
                                            />
                                        </div>
                                    </form>
                                )}
                                {["delete"].includes(type) && (
                                    <div className="text-gray-500">
                                        <p>Yakin ingin hapus ?</p>
                                        <p>
                                            Data kategori laporan{" "}
                                            <span className="text-red-500">
                                                {selectedData?.nama}
                                            </span>{" "}
                                            akan dihapus selamanya.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                {["create", "update"].includes(type) && (
                                    <button
                                        form="Form"
                                        type="submit"
                                        className="bg-green-500"
                                        disabled={loading}
                                    >
                                        {loading ? "Menyimpan..." : "Simpan"}
                                    </button>
                                )}
                                {["delete"].includes(type) && (
                                    <button
                                        type="button"
                                        className="bg-red-500"
                                        disabled={loading}
                                        onClick={submitDelete}
                                    >
                                        {loading ? "Menghapus..." : "Hapus"}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="bg-gray-500"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default KategoriLaporanModal;
