package be.pxl.services.domain;

public enum Status {
    DRAFT,       // Post is een concept
    SUBMITTED,   // Post is ingediend voor review
    APPROVED,    // Post is goedgekeurd
    REJECTED     // Post is afgewezen
}
