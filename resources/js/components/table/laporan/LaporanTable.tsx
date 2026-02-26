import { formatWIB } from "../../../utils/dateUtils";
import { LaporanType } from "../../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import axiosClient from "../../../utils/axios";
import { useEffect, useState } from "react";
import Spinner from "../../Spinner";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon as MagGlassI,
} from "@heroicons/react/16/solid";
import { useDebounce } from "use-debounce";
import SupplierModal from "./LaporanModal";
import TopBar from "../TopBar";
import BottomBar from "../BottomBar";
import LaporanModal from "./LaporanModal";

interface formDataType {
    pelapor_id: string;
    kategori_id: string;
    judul: string;
    isi_laporan: string;
    status: "Diajukan" | "Diproses" | "Selesai" | "Ditolak";
}

const LaporanTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [selectedData, setSelectedData] = useState<LaporanType | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [postModal, setPostModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, error, isFetching } = useQuery({
        queryKey: ["laporan", pagination.pageIndex, debouncedSearch],
        queryFn: () => {
            return axiosClient
                .get("/laporan", {
                    params: {
                        page: pagination.pageIndex + 1,
                        per_page: pagination.pageSize,
                        search: debouncedSearch,
                    },
                })
                .then((response) => {
                    return response.data.data;
                })
                .catch((error) => {
                    throw error;
                });
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev,
    });

    const columnHelper = createColumnHelper<LaporanType>();
    const columns = [
        {
            id: "row-number",
            header: "#",
            cell: (info: { row: { index: number } }) => {
                return (
                    pagination.pageIndex * pagination.pageSize +
                    info.row.index +
                    1
                );
            },
        },
        columnHelper.accessor("pelapor.nama", {
            header: "Pelapor",
            cell: (info) => (
                <span className="capitalize">{info.cell.getValue()}</span>
            ),
        }),
        columnHelper.accessor("kategori.nama", {
            header: "Kategori",
        }),
        columnHelper.accessor("judul", {
            header: "Judul",
        }),
        columnHelper.accessor("status", {
            header: "Status",
        }),
        columnHelper.accessor("updated_at", {
            cell: (info) => formatWIB(info.getValue()),
            header: "Diperbarui",
        }),
        {
            id: "action",
            header: "Action",
            footer: "Action",
            cell: ({ row }: any) => (
                <div className="inline-flex gap-1">
                    <button
                        className="bg-cyan-500 inline-flex items-center gap-1"
                        onClick={() => {
                            setSelectedData(row.original);
                            setDetailsModal(true);
                        }}
                    >
                        <EyeIcon className="size-5" />
                        Lihat
                    </button>
                    <button
                        className="bg-yellow-500 inline-flex items-center gap-1"
                        onClick={() => {
                            setSelectedData(row.original);
                            setUpdateModal(true);
                        }}
                    >
                        <PencilIcon className="size-5" />
                        Ubah
                    </button>
                    <button
                        className="bg-red-500 inline-flex items-center gap-1"
                        onClick={() => {
                            setSelectedData(row.original);
                            setDeleteModal(true);
                        }}
                    >
                        <TrashIcon className="size-5" />
                        Hapus
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data?.last_page ?? -1,
        state: {
            pagination: {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
            },
        },
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    });

    const [formData, setFormData] = useState<formDataType>({
        pelapor_id: '',
        kategori_id: '',
        isi_laporan: "",
        judul: "",
        status: "Diajukan",
    });
    const formInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const resetForm = () => {
        setFormData({
            pelapor_id: '',
            kategori_id: '',
            isi_laporan: "",
            judul: "",
            status: "Diajukan",
        });
    };
    const fillForm = () => {
        setFormData({
            pelapor_id: selectedData?.pelapor_id || '',
            kategori_id: selectedData?.kategori_id || '',
            isi_laporan: selectedData?.isi_laporan || "",
            judul: selectedData?.judul || "",
            status: selectedData?.status || "Diajukan",
        });
    };

    useEffect(() => {
        if (updateModal) {
            fillForm();
        } else {
            resetForm();
        }
    }, [updateModal]);
    useEffect(() => {
        if (postModal) {
            resetForm();
        }
    }, [postModal]);
    useEffect(() => {
        if (detailsModal) {
            fillForm();
        } else {
            resetForm();
        }
    }, [detailsModal]);

    if (error) return <p>Error loading data</p>;

    return (
        <>
            {/* Table */}
            <div className="overflow-x-auto mt-2">
                <TopBar
                    searchValue={search}
                    onChangeSearch={(e) => {
                        setSearch(e.target.value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    onClickTambah={() => setPostModal(true)}
                />
                <div className="relative">
                    {isFetching && (
                        <div className="absolute w-full h-full flex items-center justify-center bg-white opacity-50">
                            <Spinner />
                        </div>
                    )}
                    <table className="table">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length <= 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center">
                                        No Data
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={
                                                    cell.column.id ===
                                                        "row-number" ||
                                                    cell.column.id === "action"
                                                        ? "text-center"
                                                        : "text-left"
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Paginasi */}
            <BottomBar table={table} />

            {/* Modal */}
            <LaporanModal
                state={detailsModal}
                type="read"
                formData={formData}
                onClose={() => setDetailsModal(false)}
                selectedData={selectedData}
            />
            <LaporanModal
                state={postModal}
                type="create"
                formData={formData}
                onClose={() => setPostModal(false)}
                formInputChange={formInputChange}
                selectedData={selectedData}
            />
            <LaporanModal
                state={updateModal}
                type="update"
                formData={formData}
                onClose={() => setUpdateModal(false)}
                formInputChange={formInputChange}
                selectedData={selectedData}
            />
            <LaporanModal
                state={deleteModal}
                type="delete"
                onClose={() => setDeleteModal(false)}
                selectedData={selectedData}
            />
        </>
    );
};

export default LaporanTable;
