package be.pxl.services.controller;

import be.pxl.services.domain.Comment;
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
    public ResponseEntity<CommentResponse> addComment(@RequestBody CommentRequest commentRequest) {
        try {
            CommentResponse savedComment = commentService.addComment(commentRequest);
            try {
                commentMessageProducer.sendMessage(commentRequest);
            } catch (Exception e) {
                return new ResponseEntity<>( savedComment,HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteCommentByPostId(@PathVariable Long postId) {
        commentService.deleteCommentsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long commentId, @RequestBody CommentRequest commentRequest) {
        try {
            CommentResponse updatedComment = commentService.updateComment(commentId, commentRequest);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteCommentById(commentId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
