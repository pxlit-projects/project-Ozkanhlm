package be.pxl.services.controller;

import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;

    @GetMapping
    public ResponseEntity getPosts(){
        return new ResponseEntity(postService.getAllPosts(), HttpStatus.OK);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addPost(@RequestBody PostRequest postRequest){
        postService.addPost(postRequest);
    }
}
