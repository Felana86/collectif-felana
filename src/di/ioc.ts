//src/di/ioc.ts
import { asClass, asFunction, createContainer, BuildResolverOptions } from 'awilix';
import { UserRepositoryImpl } from '../infrastructure/repositoriesImpl/UserRespositoryImpl';
import { UserApi } from '../infrastructure/providers/http/userApi';
import { NotifRepositoryImpl } from '../infrastructure/repositoriesImpl/NotifRespositoryImpl';
import { NotifApi } from '../infrastructure/providers/http/notifApi';
import { EventRepositoryImpl } from '../infrastructure/repositoriesImpl/EventRespositoryImpl';
import { EventApi } from '../infrastructure/providers/http/eventApi';
import { UserService } from '../infrastructure/services/userService';
import { ParticipantRepositoryImpl } from '../infrastructure/repositoriesImpl/ParticipantRespositoryImpl';
import { ParticipantApi } from '../infrastructure/providers/http/participantApi';
import { AuthApi } from '../infrastructure/providers/http/authApi';
import { AuthRepositoryImpl } from '../infrastructure/repositoriesImpl/AuthRespositoryImpl';
import { ResetPasswordApi } from '../infrastructure/providers/http/resetPassword.api';
import { ResetPasswordRepositoryImpl } from '../infrastructure/repositoriesImpl/ResetPasswordRespositoryImpl';
import { ProfileRepositoryImpl } from '../infrastructure/repositoriesImpl/ProfileRespositoryImpl';
import { profileMeViewModel } from '../presenter/views/profileViewModel';
import { ProfileApi } from '../infrastructure/providers/http/profileApi';
import { ProfileService } from '../infrastructure/services/profileService';
import { AddressRepositoryImpl } from '../infrastructure/repositoriesImpl/AddressRespositoryImpl';
import { AddressService } from '../infrastructure/services/addressService';
import { AddressApi } from '../infrastructure/providers/http/addressApi';
import { eventIdViewModel, eventsWeekViewModel, eventViewModel } from '../presenter/views/eventViewModel';
import { AuthService } from '../infrastructure/services/authService';
import { ResetPasswordService } from '../infrastructure/services/resetPasswordService';
import { ServiceApi } from '../infrastructure/providers/http/serviceApi';
import { ServiceRepositoryImpl } from '../infrastructure/repositoriesImpl/ServiceRespositoryImpl';
import { serviceIdViewModel, serviceViewModel } from '../presenter/views/serviceViewModel';
import { ServiceService } from '../presenter/views/viewsEntities/serviceService';
import { GetUserMeUseCase } from '../application/useCases/user.usecase';
import { DeleteEventUseCase, GetEventByIdUseCase, GetEventsUseCase, PostEventUseCase, UpdateEventUseCase } from '../application/useCases/event.usecase';
import { DeleteAccountConfirmUseCase, DeleteAccountUseCase, SignInUseCase, SignInVerifyUseCase, SignUpUseCase } from '../application/useCases/auth.useCase';
import { UpdateAddressUseCase } from '../application/useCases/address.useCase';
import { ResetPasswordUpdateUseCase, ResetPasswordUseCase } from '../application/useCases/resetPassword.useCase';
import { GetServicesUseCase, GetServiceByIdUseCase, UpdateServiceUseCase, DeleteServiceUseCase, PostServiceUseCase, CancelRespServiceUseCase, FinishServiceUseCase, ValidRespServiceUseCase, RespServiceUseCase } from '../application/useCases/service.usecase';
import { NotifService } from '../presenter/views/viewsEntities/notifService';
import { GetNotifUseCase } from '../application/useCases/notif.usecase';
import { ToogleParticipantUseCase } from '../application/useCases/participants.useCase';
import { PostProfileUseCase, UpdateProfileUseCase } from '../application/useCases/profile.useCase';
import { notifViewModel } from '../presenter/views/notifViewModel';


// Extend the BuildResolverOptions type to include 'deps'
export interface ExtendedBuildResolverOptions<T> extends BuildResolverOptions<T> {
    deps?: string[];
}

const container = createContainer();
container.register({

    ////AUTH 
    signInUseCase: asClass(SignInUseCase),
    signUpUseCase: asClass(SignUpUseCase),
    signInVerifyUseCase: asClass(SignInVerifyUseCase),
    deleteAccountUseCase: asClass(DeleteAccountUseCase),
    deleteAccountConfirmUseCase: asClass(DeleteAccountConfirmUseCase),
    authRepository: asClass(AuthRepositoryImpl),
    authData: asClass(AuthApi),
    authService: asClass(AuthService),

    ////ADDRESS
    updateAddressUseCase: asClass(UpdateAddressUseCase),
    addressRepository: asClass(AddressRepositoryImpl),
    addressService: asClass(AddressService),
    addressData: asClass(AddressApi),

    ////RESET PASSWORD
    resetPasswordUseCase: asClass(ResetPasswordUseCase),
    resetPasswordUpdateUseCase: asClass(ResetPasswordUpdateUseCase),
    resetPasswordRepository: asClass(ResetPasswordRepositoryImpl),
    resetPasswordData: asClass(ResetPasswordApi),
    resetPasswordService: asClass(ResetPasswordService),

    ////USER
    getUserMeUseCase: asClass(GetUserMeUseCase),
    userRepository: asClass(UserRepositoryImpl),
    userService: asClass(UserService),
    userData: asClass(UserApi),

    ////PROFILE
    postProfileUseCase: asClass(PostProfileUseCase),
    updateProfileUseCase: asClass(UpdateProfileUseCase),
    profileRepository: asClass(ProfileRepositoryImpl),
    profileMeViewModel: asFunction(profileMeViewModel),
    profileService: asClass(ProfileService),
    profileData: asClass(ProfileApi),

    ////NOTIFS
    notifViewModel: asFunction(notifViewModel),
    getNotifUseCase: asClass(GetNotifUseCase),
    notifService: asClass(NotifService),
    notifRepository: asClass(NotifRepositoryImpl),
    notifData: asClass(NotifApi),

    ////EVENTS
    getEventsUseCase: asClass(GetEventsUseCase),
    getEventByIdUseCase: asClass(GetEventByIdUseCase),
    postEventUseCase: asClass(PostEventUseCase),
    updateEventUseCase: asClass(UpdateEventUseCase),
    deleteEventUseCase: asClass(DeleteEventUseCase),
    eventRepository: asClass(EventRepositoryImpl),
    eventViewModel: asFunction(eventViewModel),
    eventIdViewModel: asFunction(eventIdViewModel),
    eventsWeekViewModel: asFunction(eventsWeekViewModel),
    eventData: asClass(EventApi),

    ////PARTICIPANTS
    toogleParticipantUseCase: asClass(ToogleParticipantUseCase),
    participantRepository: asClass(ParticipantRepositoryImpl),
    participantData: asClass(ParticipantApi),

    ////SERVICES
    getServicesUseCase: asClass(GetServicesUseCase),
    getServiceByIdUseCase: asClass(GetServiceByIdUseCase),
    postServiceUseCase: asClass(PostServiceUseCase),
    updateServiceUseCase: asClass(UpdateServiceUseCase),
    respServiceUseCase: asClass(RespServiceUseCase),
    validRespServiceUseCase: asClass(ValidRespServiceUseCase),
    cancelRespServiceUseCase: asClass(CancelRespServiceUseCase),
    finishServiceUseCase: asClass(FinishServiceUseCase),
    deleteServiceUseCase: asClass(DeleteServiceUseCase),
    serviceRepository: asClass(ServiceRepositoryImpl),
    serviceData: asClass(ServiceApi),
    serviceViewModel: asFunction(serviceViewModel),
    serviceIdViewModel: asFunction(serviceIdViewModel),
    serviceService: asClass(ServiceService),
});

// Log all registered components
console.log('Registered components:', container.registrations);

// TEST RESOLVE EXA
//console.log('addressUserCase:', container.resolve('addressUseCase').getAddresses());



export default container;