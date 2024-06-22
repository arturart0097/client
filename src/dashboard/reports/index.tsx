/* eslint-disable no-console */
import { ReactElement, useEffect, useRef, useState } from "react";
import { AuthUser } from "http/services/auth.service";
import {
    createReportCollection,
    getReportsList,
    getUserReportCollectionsContent,
} from "http/services/reports.service";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import "./index.css";
import { getKeyValue } from "services/local-storage.service";
import { LS_APP_USER } from "common/constants/localStorage";
import { BaseResponseError } from "common/models/base-response";
import { useToast } from "dashboard/common/toast";
import { TOAST_LIFETIME } from "common/settings";
import { Panel, PanelHeaderTemplateOptions } from "primereact/panel";
import { MultiSelect } from "primereact/multiselect";
import { ReportCollectionContent, ReportDocument } from "common/models/reports";
import ModalEditAccess from "./ModalEditAccess"; // Adjusted import

interface Report {
    id: string;
    name: string;
}

interface CollectionOption {
    id: string;
    name: string;
    type: "report" | "collection";
}

interface ModalMethods {
    open: () => void;
    close: () => void;
}

export default function Reports(): ReactElement {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [reportSearch, setReportSearch] = useState<string>("");
    const [reports, setReports] = useState<ReportDocument[]>([]);
    const [collections, setCollections] = useState<ReportCollectionContent[]>([]);
    const [collectionName, setCollectionName] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<CollectionOption[]>([]);
    const modalRef = useRef<ModalMethods>(null); // Updated useRef to ModalMethods

    const toast = useToast();

    
    console.log(collections)

    useEffect(() => {
        const authUser: AuthUser = getKeyValue(LS_APP_USER);
        setUser(authUser);
    }, []);

    useEffect(() => {
        if (user) {
            handleGetReportList(user.useruid);
            handleGetUserReportCollections(user.useruid);
        }
    }, [user]); // Removed toast dependency from useEffect

    const handleGetReportList = (useruid: string) =>
        getReportsList(useruid)
            .then((response) => {
                console.log("getReportsList response:", response); // Log response
                if (!response) {
                    throw new Error("Response is undefined");
                }
                const { error } = response as BaseResponseError;
                if (error && toast.current) {
                    return toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error,
                        life: TOAST_LIFETIME,
                    });
                }
                const documents = response as ReportDocument[];
                setReports(documents);
            })
            .catch((error) => {
                console.error("Error fetching report list:", error);
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error.message,
                        life: TOAST_LIFETIME,
                    });
                }
            });

    const handleGetUserReportCollections = (useruid: string) =>
        getUserReportCollectionsContent(useruid)
            .then((response) => {
                console.log("getUserReportCollectionsContent response:", response); // Log response
                if (!response) {
                    throw new Error("Response is undefined");
                }
                const { error } = response as BaseResponseError;
                if (error && toast.current) {
                    return toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error,
                        life: TOAST_LIFETIME,
                    });
                }
                const collections = response as ReportCollectionContent[];
                setCollections(collections);
            })
            .catch((error) => {
                console.error("Error fetching report collections:", error);
                if (toast.current) {
                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: error.message,
                        life: TOAST_LIFETIME,
                    });
                }
            });

    const handleCreateCollection = () => {
        if (collectionName) {
            createReportCollection(user!.useruid, collectionName)
                .then((response) => {
                    console.log("createReportCollection response:", response); // Log response
                    if (!response) {
                        throw new Error("Response is undefined");
                    }
                    const { error, data } = response as {
                        error?: string;
                        data?: ReportCollectionContent;
                    };
                    if (error && toast.current) {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: error,
                            life: TOAST_LIFETIME,
                        });
                    } else if (data) {
                        setCollections((prevCollections) => [...prevCollections, data]); // Add new collection to state
                    }
                })
                .catch((error) => {
                    console.error("Error creating collection:", error);
                    if (toast.current) {
                        toast.current.show({
                            severity: "error",
                            summary: "Error",
                            detail: error.message,
                            life: TOAST_LIFETIME,
                        });
                    }
                });
        }
    };

    const editModalHandler = () => {
        if (modalRef.current) {
            modalRef?.current?.open();
        }
    };

    const ActionButtons = ({ reportuid }: { reportuid: string }): ReactElement => {
        return (
            <div className='reports-actions flex gap-3'>
                <Button className='p-button' icon='pi pi-plus' outlined />
                <Button className='p-button' icon='pi pi-heart' outlined />
                <Button className='p-button reports-actions__button' outlined>
                    Preview
                </Button>
                <Button className='p-button reports-actions__button' outlined>
                    Download
                </Button>
            </div>
        );
    };

    const ReportsAccordionHeader = ({
        title,
        info,
    }: {
        title: string;
        info: string;
    }): ReactElement => {
        return (
            <div className='reports-accordion-header flex gap-1'>
                <div className='reports-accordion-header__title'>{title}</div>
                <div className='reports-accordion-header__info'>{info}</div>
            </div>
        );
    };

    const ReportsPanelHeader = (options: PanelHeaderTemplateOptions) => {
        return (
            <div className='reports-header col-12 px-0 pb-3'>
                <Button
                    icon='pi pi-plus'
                    className='reports-header__button'
                    onClick={options.onTogglerClick}
                >
                    New collection
                </Button>
                <Button className='reports-header__button'>Custom Report</Button>
                <span className='p-input-icon-right reports-header__search'>
                    <i
                        className={`pi pi-${!reportSearch ? "search" : "times cursor-pointer"}`}
                        onClick={() => setReportSearch("")}
                    />
                    <InputText
                        value={reportSearch}
                        placeholder='Search'
                        onChange={(e) => setReportSearch(e.target.value)}
                    />
                </span>
            </div>
        );
    };

    const combinedOptions: (CollectionOption | { label: string; value: string })[] = [
        { label: "Reports", value: "reportsHeader" },
        ...reports.map((report) => ({ id: report.id, name: report.name, type: "report" as const })),
        { label: "Collections", value: "collectionsHeader" },
        ...collections.map((collection) => ({
            id: collection.itemUID,
            name: collection.name,
            type: "collection" as const,
        })),
    ];

    return (
        <>
            <div className='grid'>
                <div className='col-12'>
                    <div className='card reports'>
                        <div className='card-header'>
                            <h2 className='card-header__title uppercase m-0'>Reports</h2>
                        </div>
                        <div className='card-content'>
                            <div className='grid'>
                                <div className='col-12'>
                                    <Panel
                                        headerTemplate={ReportsPanelHeader}
                                        className='new-collection w-full'
                                        collapsed
                                        toggleable
                                    >
                                        <h3 className='uppercase new-collection__title'>
                                            Add new collection
                                        </h3>
                                        <div className='grid new-collection__form'>
                                            <div className='col-4'>
                                                <InputText
                                                    className='w-full'
                                                    value={collectionName}
                                                    onChange={(e) =>
                                                        setCollectionName(e.target.value)
                                                    }
                                                    placeholder='Collection name'
                                                />
                                            </div>
                                            <div className='col-8'>
                                                <MultiSelect
                                                    filter
                                                    optionLabel='name'
                                                    options={combinedOptions}
                                                    className='w-full new-collection__multiselect'
                                                    placeholder='Select reports or collections'
                                                    showSelectAll={false}
                                                    value={selectedOptions}
                                                    display='chip'
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedOptions(e.value);
                                                    }}
                                                    pt={{
                                                        wrapper: {
                                                            style: {
                                                                minHeight: "420px",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div className='col-12 flex justify-content-end'>
                                                <Button onClick={handleCreateCollection} outlined>
                                                    Create collection
                                                </Button>
                                            </div>
                                        </div>
                                    </Panel>
                                </div>
                                <div className='col-12'>
                                    <Accordion multiple className='reports__accordion'>
                                        {collections &&
                                            collections.map((collection) => (
                                                <AccordionTab
                                                    key={collection.itemUID}
                                                    header={
                                                        <ReportsAccordionHeader
                                                            title={collection.name}
                                                            info={`(${
                                                                collection?.documents?.length ?? 0
                                                            } reports)`}
                                                        />
                                                    }
                                                    className='reports__accordion-tab'
                                                >
                                                    {collection?.documents?.map((el) => (
                                                        <div
                                                            className='collection_items'
                                                            key={el.itemUID}
                                                            onClick={editModalHandler}
                                                        >
                                                            {el.name}
                                                            <div>
                                                                <button data-tooltip='Add to Collection'>
                                                                    1
                                                                </button>
                                                                <button data-tooltip='Like this Collection'>
                                                                    2
                                                                </button>
                                                                <button data-tooltip='Users with access'>
                                                                    3
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </AccordionTab>
                                            ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalEditAccess ref={modalRef} title='Edit access'>
                <div>
                    {/* <MultiSelect
                        style={{ zIndex: "2" }}
                        optionValue='value'
                        optionLabel='label'
                        placeholder='Filter'
                        className='w-full pb-0 h-full flex align-items-center inventory-filter'
                        display='chip'
                        selectedItemsLabel='Clear Filter'
                        pt={{
                            header: {
                                className: "inventory-filter__header",
                            },
                            wrapper: {
                                className: "inventory-filter__wrapper",
                                style: {
                                    maxHeight: "500px",
                                },
                            },
                        }}
                    /> */}
                </div>
            </ModalEditAccess>
        </>
    );
}
