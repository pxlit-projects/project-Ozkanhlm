package be.pxl.services.service;

import be.pxl.services.domain.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
//    In productie mail sturen.
    public void sendMessage(Notification notification) {
        log.info("Receiving notification...");
        log.info("Sending... {}", notification.getMessage());
        log.info("To.. {}", notification.getSender());
    }
}
