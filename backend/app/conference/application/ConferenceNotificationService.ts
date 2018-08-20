import { Service } from 'typedi'
import { ConferenceNotificationRepository } from 'backend/app/conference/external/ConferenceNotificationRepository'
import { PushNotificationService } from 'backend/app/device/application/PushNotificationService'
import { EventListener } from 'backend/app/common/external/amqp/EventListener'
import { ConferenceNotificationSendRequest } from 'backend/app/conference/domain/ConferenceNotification'
import { DateProvider } from 'backend/app/common/DateProvider'
import { UserRepository } from 'backend/app/user/external/UserRepository'
import { DeviceRepository } from 'backend/app/device/external/DeviceRepository'
import { oneOf } from 'backend/app/common/CrudRepository'
import { Device } from 'backend/app/device/domain/Device'
import { PushNotificationRequest } from 'backend/app/device/domain/PushNotificationRequest'
import { ConferenceNotificationTargeter } from 'backend/app/conference/application/ConferenceNotificationTargeter'
import { NotificationTarget } from 'backend/app/conference/domain/NotificationTarget'

@Service()
export class ConferenceNotificationService {
  constructor(
    private conferenceNotificationRepository: ConferenceNotificationRepository,
    private pushNotificationService: PushNotificationService,
    private userRepository: UserRepository,
    private deviceRepository: DeviceRepository,
    private dateProvider: DateProvider,
    private notificationTargeter: ConferenceNotificationTargeter,
  ) {}

  @EventListener(ConferenceNotificationSendRequest)
  async handleSendNotificationsRequest(
    request: ConferenceNotificationSendRequest,
  ) {
    const devices = await this.getDevicesForTarget(
      this.notificationTargeter.getTargetsForNotification(request),
    )

    await this.sendNotificationsToDevices(request, devices)
    await this.recordNotificationSent(request)
  }

  private async recordNotificationSent(
    request: ConferenceNotificationSendRequest,
  ) {
    await this.conferenceNotificationRepository.insert({
      ...request,
      timeSent: this.dateProvider.now(),
    })
  }

  private async sendNotificationsToDevices(
    request: ConferenceNotificationSendRequest,
    devices: Device[],
  ) {
    await this.pushNotificationService.sendNotifications(
      devices.map(device => this.createPushNotification(device, request)),
    )
  }

  private async getDevicesForTarget(target: NotificationTarget) {
    const users = await this.userRepository.find({
      optedIntoNotifications: true,
      ...target.user,
    })

    return this.deviceRepository.find({
      owner: oneOf(...users.map(u => u.id)),
      ...target.device,
    })
  }

  private createPushNotification(
    device: Device,
    request: ConferenceNotificationSendRequest,
  ): PushNotificationRequest {
    return {
      deviceId: device.id,
      payload: {
        title: request.title,
        to: device.deviceToken!,
        body: request.message,
        priority: request.urgent ? 'high' : 'normal',
        data: this.notificationTargeter.getNotificationMetadata(request),
        sound: request.urgent ? 'default' : null,
      },
    }
  }
}