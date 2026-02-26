import React, { useEffect, useState } from "react";
import { LaporanType } from "../../../types";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosClient from "../../../utils/axios";
import SelectInput, { OptionType } from "../SelectInput";

interface formDataType {
    pelapor_id: string;
    kategori_id: string;
    judul: string;
    isi_laporan: string;
    status: "Diajukan" | "Diproses" | "Selesai" | "Ditolak";
}

type BaseModalProps = {
    state: boolean;
    selectedData: LaporanType | null;
    onClose: () => void;
    formInputChange?: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => void;
};

type ReadProps = BaseModalProps & {
    type: "read";
    formData: formDataType;
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

type ModalProps = DeleteModalProps | CreateUpdateProps | ReadProps;

const LaporanModal = ({
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
            return await axiosClient.post(`/laporan`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "laporan",
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
                `/laporan/${selectedData!.id}`,
                formData,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "laporan",
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
            return await axiosClient.delete(`/laporan/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "laporan",
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

    const { data: listKategori, isFetching: kategoriFetching } = useQuery({
        queryKey: ["kategori_laporan"],
        queryFn: () => {
            return axiosClient
                .get("/kategori_laporan/list")
                .then((response) => {
                    return response.data.data;
                })
                .catch((error) => {
                    throw error;
                });
        },
        staleTime: 1000 * 60 * 5,
        enabled: ["update", "create"].includes(type),
        refetchOnMount: true,
    });

    const kategoriOptions = listKategori?.map(
        (item: { id: any; nama: any }) => ({
            value: item.id,
            label: item.nama,
        }),
    );

    const { data: listPelapor, isFetching: pelaporFetching } = useQuery({
        queryKey: ["pelapor"],
        queryFn: () => {
            return axiosClient
                .get("/pelapor/list")
                .then((response) => {
                    return response.data.data;
                })
                .catch((error) => {
                    throw error;
                });
        },
        staleTime: 1000 * 60 * 5,
        enabled: ["update", "create"].includes(type),
        refetchOnMount: true,
    });

    const pelaporOptions = listPelapor?.map((item: { id: any; nama: any }) => ({
        value: item.id,
        label: item.nama,
    }));

    const statusOptions: OptionType[] = [
        { value: "Diajukan", label: "Diajukan" },
        { value: "Diproses", label: "Diproses" },
        { value: "Selesai", label: "Selesai" },
        { value: "Ditolak", label: "Ditolak" },
    ];

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
                                    Laporan
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
                                                htmlFor="pelapor_id"
                                            >
                                                Pelapor
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.pelapor_id}
                                                </span>
                                            )}
                                            <SelectInput
                                                name="pelapor_id"
                                                value={formData!.pelapor_id}
                                                onChange={formInputChange!}
                                                options={pelaporOptions}
                                                isDisabled={type === "read"}
                                                isLoading={pelaporFetching}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="kategori_id"
                                            >
                                                Kategori
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.kategori_id}
                                                </span>
                                            )}
                                            <SelectInput
                                                name="kategori_id"
                                                value={formData!.kategori_id}
                                                onChange={formInputChange!}
                                                options={kategoriOptions}
                                                isDisabled={type === "read"}
                                                isLoading={kategoriFetching}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="judul"
                                            >
                                                Judul*
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.judul}
                                                </span>
                                            )}
                                            <input
                                                name="judul"
                                                onChange={formInputChange}
                                                value={formData?.judul}
                                                type="text"
                                                id="judul"
                                                className="form-input"
                                                placeholder="Judul..."
                                                disabled={type === "read"}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="isi_laporan"
                                            >
                                                Isi Laporan*
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.isi_laporan}
                                                </span>
                                            )}
                                            <input
                                                name="isi_laporan"
                                                onChange={formInputChange}
                                                value={formData?.isi_laporan}
                                                type="text"
                                                id="isi_laporan"
                                                className="form-input"
                                                placeholder="Isi Laporan..."
                                                disabled={type === "read"}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-gray-700 mb-1"
                                                htmlFor="status"
                                            >
                                                Status
                                            </label>
                                            {errorMsg && (
                                                <span className="text-red-500">
                                                    {errorMsg?.kategori_id}
                                                </span>
                                            )}
                                            <SelectInput
                                                name="status"
                                                value={formData!.status}
                                                onChange={formInputChange!}
                                                options={statusOptions}
                                                isDisabled={type === "read"}
                                                isLoading={kategoriFetching}
                                            />
                                        </div>
                                    </form>
                                )}
                                {["delete"].includes(type) && (
                                    <div className="text-gray-500">
                                        <p>Yakin ingin hapus ?</p>
                                        <p>
                                            Data{" "}
                                            <span className="text-red-500">
                                                {selectedData?.judul}
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

export default LaporanModal;
