package be.pxl.services.service;

import be.pxl.services.domain.Notification;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    Dotenv dotenv = Dotenv.load();
    public void sendMessage(Notification notification) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(dotenv.get("SPRING_MAIL_USERNAME"));
            message.setTo(notification.getTo());
            message.setText(notification.getText());
            message.setSubject(notification.getSubject());

            mailSender.send(message);
            logger.info("E-mail succesvol verzonden naar: {}", notification.getTo());

        } catch (Exception e) {
            logger.error("Fout bij het verzenden van de e-mail: {}", e.getMessage());
            throw new RuntimeException("E-mail kan niet verzonden worden", e);
        }
    }
}
