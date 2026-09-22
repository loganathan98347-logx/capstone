package CampusConnect.controller;

import CampusConnect.entity.Notification;
import CampusConnect.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }


    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId
    ) {

        List<Notification> notifications =
                notificationService.getUserNotifications(userId);

        return ResponseEntity.ok(notifications);
    }


    // =====================================================
    // GET UNREAD NOTIFICATIONS
    // =====================================================

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId
    ) {

        List<Notification> notifications =
                notificationService.getUnreadNotifications(userId);

        return ResponseEntity.ok(notifications);
    }


    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable Long userId
    ) {

        long count =
                notificationService.getUnreadCount(userId);

        return ResponseEntity.ok(count);
    }


    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long notificationId
    ) {

        Notification notification =
                notificationService.markAsRead(notificationId);

        return ResponseEntity.ok(notification);
    }


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<String> markAllAsRead(
            @PathVariable Long userId
    ) {

        notificationService.markAllAsRead(userId);

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }


    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody NotificationRequest request
    ) {

        Notification notification =
                notificationService.createNotification(
                        request.getUserId(),
                        request.getTitle(),
                        request.getMessage(),
                        request.getType()
                );

        return ResponseEntity.ok(notification);
    }


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long notificationId
    ) {

        notificationService.deleteNotification(
                notificationId
        );

        return ResponseEntity.ok(
                "Notification deleted successfully"
        );
    }


    // =====================================================
    // REQUEST CLASS
    // =====================================================

    public static class NotificationRequest {

        private Long userId;
        private String title;
        private String message;
        private String type;


        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }


        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }


        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }


        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}