package be.pxl.services.controller;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.messaging.CommentMessageProducer;
import be.pxl.services.services.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    private final ICommentService commentService;
    private final CommentMessageProducer commentMessageProducer;

    @GetMapping
    public ResponseEntity getComments(){
        return new ResponseEntity(commentService.getAllComments(), HttpStatus.OK);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> addComment(@RequestBody CommentRequest commentRequest) {
        try {
            commentService.addComment(commentRequest);
            try {
                commentMessageProducer.sendMessage(commentRequest);
            } catch (Exception e) {
                return new ResponseEntity<>("Comment saved, but failed to send message to RabbitMQ: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("Comment added successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to save comment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteCommentByPostId(@PathVariable Long postId) {
        commentService.deleteCommentsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
