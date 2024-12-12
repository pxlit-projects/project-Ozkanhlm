package be.pxl.services.controller;

import be.pxl.services.domain.Category;
import be.pxl.services.domain.Status;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    private final IPostService postService;
    @GetMapping
    public ResponseEntity getPosts(){
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addPost(@RequestBody PostRequest postRequest){
        logger.info("****Received post request: {}****", postRequest);
        logger.info("Received content of length: {}", postRequest.getContent().length());
        postService.addPost(postRequest);
    }

    @GetMapping("/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public PostResponse findPostById(@PathVariable Long postId) {
        return postService.findPostById(postId);
    }

    @PutMapping("/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long postId, @RequestBody PostRequest postRequest) {
        PostResponse updatedPost = postService.updatePost(postId, postRequest);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
    }
    @GetMapping("/categories")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getCategories() {
        return postService.getCategories();
    }

    @GetMapping("/statuses")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getStatuses() {
        return postService.getStatuses();
    }
}
