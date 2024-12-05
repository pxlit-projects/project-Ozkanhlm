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
        postService.addPost(postRequest);
    }

    @GetMapping("/{postId}")
    public PostResponse findPostById(@PathVariable Long postId) {
        return postService.findPostById(postId);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return Arrays.stream(Category.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/statuses")
    public List<String> getStatuses() {
        return Arrays.stream(Status.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}
