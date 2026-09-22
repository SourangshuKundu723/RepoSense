package repoSense.backend.dto;

public record CitationDto(
    String filePath,
    Integer startLine,
    Integer endLine,
    String language) {
}