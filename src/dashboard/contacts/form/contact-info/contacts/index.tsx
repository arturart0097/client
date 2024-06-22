import { observer } from "mobx-react-lite";
import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactElement, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useStore } from "store/hooks";
import { useFormikContext } from "formik";
import { Contact } from "common/models/contact";

interface SocialInputProps extends InputTextProps {
    social: "Skype" | "Facebook" | "WhatsApp" | "Slack";
}

const socialIcons: { [key: string]: ReactElement } = {
    skype: (
        <svg
            version='1.1'
            viewBox='0 -8 45 67'
            xmlns='http://www.w3.org/2000/svg'
            fill='#A4A6A8'
            className='pi pi-skype contact-social__icon'
        >
            <path
                d='M34.84,46.38c-4.82,0.256-7.075-0.832-9.142-2.809  c-2.308-2.209-1.381-4.728,0.499-4.855c1.879-0.128,3.007,2.171,4.01,2.812c1.002,0.638,4.812,2.09,6.826-0.258  c2.191-2.554-1.458-3.875-4.134-4.276c-3.819-0.576-8.642-2.683-8.267-6.836c0.375-4.149,3.457-6.277,6.7-6.577  c4.134-0.383,6.825,0.638,8.954,2.491c2.461,2.14,1.129,4.532-0.438,4.725c-1.562,0.191-3.316-3.52-6.761-3.576  c-3.551-0.057-5.95,3.768-1.567,4.854c4.385,1.086,9.081,1.532,10.772,5.62C43.984,41.782,39.663,46.123,34.84,46.38z   M48.431,36.656c0.091-0.68,0.143-1.372,0.143-2.075c0-8.446-6.784-15.294-15.152-15.294c-0.832,0-1.647,0.07-2.441,0.202  C29.558,18.548,27.864,18,26.042,18C21.046,18,17,22.107,17,27.175c0,1.844,0.535,3.557,1.456,4.995  c-0.124,0.786-0.188,1.591-0.188,2.41c0,8.447,6.781,15.294,15.151,15.294c0.945,0,1.865-0.093,2.759-0.257  C37.567,50.491,39.204,51,40.958,51C45.953,51,50,46.893,50,41.825C50,39.909,49.423,38.128,48.431,36.656z M33,64  C16.432,64,3,50.568,3,34C3,17.431,16.432,4,33,4s30,13.431,30,30C63,50.568,49.568,64,33,64z'
                style={{
                    transform: "scale(0.7, 0.7)",
                }}
            />
        </svg>
    ),
    facebook: <i className='pi pi-facebook contact-social__icon' />,
    whatsapp: <i className='pi pi-whatsapp contact-social__icon' />,
    slack: <i className='pi pi-slack contact-social__icon' />,
};

const SocialInput = (props: SocialInputProps): ReactElement => {
    const currentIcon = socialIcons[props.social.toLowerCase()];
    return (
        <span className='p-float-label contact-social'>
            <InputText
                {...props}
                className='contact-social__input contacts-social__text-input w-full'
            />
            <label className='float-label'>{props.social}</label>
            {currentIcon}
        </span>
    );
};

export const ContactsSocialInfo = observer((): ReactElement => {
    const store = useStore().contactStore;
    const { contact, changeContact } = store;
    const { values, errors, setFieldValue, setFieldTouched, handleBlur } =
        useFormikContext<Contact>();
    const [anotherEmail, setAnotherEmail] = useState<boolean>(false);
    const [anotherPhone, setAnotherPhone] = useState<boolean>(false);

    useEffect(() => {
        setAnotherEmail(!!contact.email2?.length);
    }, [contact.email2?.length]);

    useEffect(() => {
        setAnotherPhone(!!contact.phone2?.length);
    }, [contact.phone2?.length]);

    return (
        <div className='grid contacts-social row-gap-2'>
            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`contacts-social__text-input w-full ${
                            errors.email1 ? "p-invalid" : ""
                        }`}
                        value={values.email1 || ""}
                        onBlur={handleBlur}
                        onChange={async ({ target: { value } }) => {
                            await setFieldValue("email1", value);
                            changeContact("email1", value);
                            setFieldTouched("email1", true, true);
                        }}
                    />
                    <label className='float-label'>E-mail address</label>
                </span>
                <small className='p-error'>{errors.email1}</small>
            </div>
            {anotherEmail ? (
                <div className='col-6 relative'>
                    <span className='p-float-label'>
                        <InputText
                            className={`contacts-social__text-input w-full ${
                                errors.email2 ? "p-invalid" : ""
                            }`}
                            onBlur={handleBlur}
                            value={values.email2 || ""}
                            onChange={async ({ target: { value } }) => {
                                if (!value?.length) setAnotherEmail(false);
                                await setFieldValue("email2", value);
                                changeContact("email2", value);
                                setFieldTouched("email2", true, true);
                            }}
                        />
                        <label className='float-label'>E-mail address</label>
                    </span>
                    <small className='p-error'>{errors.email2}</small>
                </div>
            ) : (
                <div className='col-6'>
                    <Button
                        type='button'
                        className='contacts__button'
                        onClick={() => setAnotherEmail(true)}
                        outlined
                    >
                        <i className='pi pi-plus mr-2 text-xs pt-1' />
                        Add another email address
                    </Button>
                </div>
            )}

            <div className='col-6 relative'>
                <span className='p-float-label'>
                    <InputText
                        className={`contacts-social__text-input w-full ${
                            errors.phone1 ? "p-invalid" : ""
                        }`}
                        onBlur={handleBlur}
                        value={values.phone1 || ""}
                        onChange={async ({ target: { value } }) => {
                            await setFieldValue("phone1", value);
                            changeContact("phone1", value);
                            setFieldTouched("phone1", true, true);
                        }}
                    />
                    <label className='float-label'>Phone Number</label>
                </span>
                <small className='p-error'>{errors.phone1}</small>
            </div>
            {anotherPhone ? (
                <div className='col-6 relative'>
                    <span className='p-float-label'>
                        <InputText
                            className={`contacts-social__text-input w-full ${
                                errors.phone2 ? "p-invalid" : ""
                            }`}
                            value={values.phone2 || ""}
                            onBlur={handleBlur}
                            onChange={async ({ target: { value } }) => {
                                if (!value?.length) setAnotherPhone(false);
                                await setFieldValue("phone2", value);
                                changeContact("phone2", value);
                                setFieldTouched("phone2", true, true);
                            }}
                        />
                        <label className='float-label'>Phone Number</label>
                    </span>
                    <small className='p-error'>{errors.phone2}</small>
                </div>
            ) : (
                <div className='col-6'>
                    <Button
                        type='button'
                        className='contacts__button'
                        outlined
                        onClick={() => setAnotherPhone(true)}
                    >
                        <i className='pi pi-plus mr-2 text-xs pt-1' />
                        Add another phone number
                    </Button>
                </div>
            )}

            <hr className='form-line' />

            <div className='col-6'>
                <SocialInput
                    social='Facebook'
                    value={contact.messager1}
                    onChange={({ target: { value } }) => changeContact("messager1", value)}
                />
            </div>
            <div className='col-6'>
                <SocialInput
                    social='WhatsApp'
                    value={contact.messager2}
                    onChange={({ target: { value } }) => changeContact("messager2", value)}
                />
            </div>

            <div className='col-6'>
                <SocialInput
                    social='Slack'
                    value={contact.messager3}
                    onChange={({ target: { value } }) => changeContact("messager3", value)}
                />
            </div>

            <div className='col-6'>
                <SocialInput
                    social='Skype'
                    value={contact.messager4}
                    onChange={({ target: { value } }) => changeContact("messager4", value)}
                />
            </div>
        </div>
    );
});
