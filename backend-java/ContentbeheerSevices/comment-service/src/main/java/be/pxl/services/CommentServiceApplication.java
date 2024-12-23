package be.pxl.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * CommentServiceApplication
 */
@SpringBootApplication
@EnableDiscoveryClient
public class CommentServiceApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(CommentServiceApplication.class, args);
    }
}
