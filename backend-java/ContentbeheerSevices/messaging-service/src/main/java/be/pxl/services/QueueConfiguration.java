package be.pxl.services;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Queue;

@Configuration
public class QueueConfiguration {
    @Bean
    public Queue myQueue() {
        return new Queue("myQueue", false);
    }
}
