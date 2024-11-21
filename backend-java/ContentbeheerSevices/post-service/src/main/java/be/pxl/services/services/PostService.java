package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository postRepository;

    @Override
    public List<PostResponse> getAllPosts() {
         List<Post> posts = postRepository.findAll();
         return posts.stream().map(post -> mapToPostResponse(post)).toList();
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .titel(post.getTitel())
                .picture(post.getPicture())
                .content(post.getContent())
                .author(post.getAuthor())
                .status(post.getStatus())
                .created_at(post.getCreated_at())
                .updated_at(post.getUpdated_at())
                .category(post.getCategory())
                .build();
    }

    @Override
    public void addPost(PostRequest postRequest) {
        Post post = Post.builder()
                .titel(postRequest.getTitel())
                .build();
        postRepository.save(post);
    }
}
