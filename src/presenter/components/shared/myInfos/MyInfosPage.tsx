import { useFormik } from 'formik';
import { object, string } from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { AuthHeader } from '../auth/auth.Comps/AuthHeader';
import { ProfileForm } from '../auth/auth.Comps/ProfileForm';
import { ProfileDTO, } from '../../../../domain/entities/Profile';
import { ConfirmModal } from '../../common/ConfirmModal';
import DI from '../../../../di/ioc';
import { Address, AddressDTO } from '../../../../domain/entities/Address';
import { LogOutButton } from '../../common/SmallComps';
import { useUserStore } from '../../../../application/stores/user.store';
import { User } from '../../../../domain/entities/User';
import { Skeleton } from '../../common/Skeleton';


export default function MyInfosPage() {
    const { setUserProfile } = useUserStore()
    const navigate = useNavigate();
    const user: User = useUserStore((state) => state.user);
    const [assistance, setAssistance] = useState<string | undefined>()
    const [mailSub, setMailSub] = useState<string | undefined>(user.Profile?.mailSub)
    const [address, setAddress] = useState<AddressDTO>(user.Profile?.Address)
    const [open, setOpen] = useState(false);
    const updateAddress = async (data: AddressDTO) => await DI.resolve('addressService').updateAddress(data)
    const updateProfile = async (data: ProfileDTO) => await DI.resolve('profileUseCase').updateProfile(data)

    const formSchema = object({
        firstName: string().required("Le prémon est obligatoire").min(2, "minmum 2 lettres"),
        lastName: string().required("Le Nom est obligatoire").min(2, "minmum 2 lettres"),
        phone: string().required("Le Numéro est obligatoire").min(10, "minmum 2 caractères").max(14, "maxmum 14 caractères").matches(/^\+33/, "Le Numéro doit commencer par +33"),
        Address: object({ city: string().required("Ville est obligatoire"), zipcode: string().required("Code postal est obligatoire") }),
        mailSub: string()
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: new ProfileDTO(user.Profile),
        validationSchema: formSchema,
        onSubmit: async values => {
            formik.values = values;
            const updatedAddress: Address = await updateAddress(address)
            formik.values.Address = updatedAddress;
            formik.values.assistance = assistance;
            formik.values.mailSub = mailSub;
            setOpen(true)
        }
    })

    const update = async () => {
        formik.values.addressId = formik.values?.Address?.id || 0
        const { Address, ...rest } = formik.values;
        const updateData = { assistance, ...rest }
        const updated = await updateProfile(updateData);
        if (updated) {
            setUserProfile(updated)
            navigate("/");
            setOpen(false)
        }
    }



    return (
        <div className="Body gray flex">
            <ConfirmModal
                open={open}
                handleOpen={() => setOpen(false)}
                handleCancel={() => { setOpen(false) }}
                handleConfirm={async () => { await update() }}
                title={"Confimrer la modification"}
                element={
                    `<p className="font-bold text-lg">Voulez vous vraiment modifier vos informations personnelles ?</p>`
                } />

            <div className="w-respLarge flex-col flex justify-between pt-1">
                <div className="flex w-respLarge justify-between items-center gap-4">
                    <LogOutButton />
                    <Link to={`/`}>
                        <Button variant="text" className="flex justify-center items-center rounded-full h-8 w-8 opacity-80">
                            <span className="material-symbols-outlined fillThin !text-4xl" >cancel</span>
                        </Button>
                    </Link>
                </div>
                <AuthHeader />
            </div>
            {!user.Profile ?
                <Skeleton /> :
                <ProfileForm
                    formik={formik}
                    setAssistance={setAssistance}
                    setAddress={setAddress}
                    setMailSub={setMailSub}
                />}
        </div >
    )
}