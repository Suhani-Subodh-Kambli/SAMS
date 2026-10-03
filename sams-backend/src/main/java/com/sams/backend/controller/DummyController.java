package com.sams.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class DummyController {
    @GetMapping("/api/v1/ping") public String ping() { return "pong"; }
}