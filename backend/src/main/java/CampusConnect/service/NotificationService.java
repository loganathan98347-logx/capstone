package CampusConnect.service;

import CampusConnect.entity.Notification;
import CampusConnect.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }


    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    public Notification createNotification(
            Long userId,
            String title,
            String message,
            String type
    ) {

        Notification notification = new Notification(
                userId,
                title,
                message,
                type
        );

        return notificationRepository.save(notification);
    }


    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    public List<Notification> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }


    // =====================================================
    // GET UNREAD NOTIFICATIONS
    // =====================================================

    public List<Notification> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }


    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }


    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    public Notification markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }


    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    public void markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
                                userId
                        );

        for (Notification notification : notifications) {

            notification.setIsRead(true);

        }

        notificationRepository.saveAll(notifications);
    }


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    public void deleteNotification(Long notificationId) {

        if (!notificationRepository.existsById(notificationId)) {

            throw new RuntimeException(
                    "Notification not found"
            );
        }

        notificationRepository.deleteById(notificationId);
    }
}