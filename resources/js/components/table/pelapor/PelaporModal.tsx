import React, { useEffect, useState } from "react";
import { PelaporType } from "../../../types";
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
    email: string;
    telepon: string;
}

type ModalProps = {
    state: boolean;
    type: "read" | "create" | "update" | "delete";
    selectedData: PelaporType | null;
    onClose: () => void;
};

const PelaporModal = ({ state, selectedData, type, onClose }: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<formDataType>({
        nama: "",
        email: "",
        telepon: "",
    });
    const formInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const resetForm = () => {
        setFormData({
            nama: "",
            email: "",
            telepon: "",
        });
    };
    const fillForm = () => {
        setFormData({
            nama: selectedData?.nama || "",
            email: selectedData?.email || "",
            telepon: selectedData?.telepon || "",
        });
    };

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/pelapor`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "pelapor",
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
                `/pelapor/${selectedData!.id}`,
                formData,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "pelapor",
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
            return await axiosClient.delete(`/pelapor/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "pelapor",
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

    useEffect(() => {
        if (state) {
            if (["update", "read"].includes(type)) {
                fillForm();
            }
        } else {
            resetForm();
            setErrorMsg(null);
        }
    }, [state]);

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
                                    {type === "read" && "Data "}
                                    {type === "update" && "Ubah "}
                                    {type === "delete" && "Hapus "}
                                    Pelapor
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
                                                Nama*
                                            </label>
                                            <input
                                                name="nama"
                                                onChange={formInputChange}
                                                value={formData?.nama}
                                                type="text"
                                                id="nama"
                                                className="form-input"
                                                placeholder="Nama..."
                                                disabled={type === "read"}
                                            />
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.nama}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="email"
                                            >
                                                Email*
                                            </label>
                                            <input
                                                name="email"
                                                onChange={formInputChange}
                                                value={formData?.email}
                                                type="email"
                                                id="email"
                                                className="form-input"
                                                placeholder="Email..."
                                                disabled={type === "read"}
                                            />
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.email}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="telepon"
                                            >
                                                Telepon*
                                            </label>
                                            <input
                                                name="telepon"
                                                onChange={formInputChange}
                                                value={formData?.telepon}
                                                type="text"
                                                id="telepon"
                                                className="form-input"
                                                placeholder="Telepon..."
                                                disabled={type === "read"}
                                            />
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.telepon}
                                                </span>
                                            )}
                                        </div>
                                    </form>
                                )}
                                {["delete"].includes(type) && (
                                    <div className="text-gray-500">
                                        <p>Yakin ingin hapus ?</p>
                                        <p>
                                            Data pelapor{" "}
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

export default PelaporModal;
