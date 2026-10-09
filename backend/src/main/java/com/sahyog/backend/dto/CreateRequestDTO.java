package com.sahyog.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateRequestDTO {
    @NotNull
    @Size(min = 1)
    private String categoryId;

    @NotNull
    @Size(min = 1)
    private String categoryName;

    @NotNull
    @Size(min = 3)
    private String title;

    @NotNull
    @Size(min = 5)
    private String problemDescription;

    @NotNull
    private String preferredDate;

    @NotNull
    private String preferredTimeSlot;

    @NotNull
    @Valid
    private AddressDTO address;

    private List<String> evidencePhotos;
    private String consumerName;
    private String consumerPhone;

    public CreateRequestDTO() {}

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTimeSlot() {
        return preferredTimeSlot;
    }

    public void setPreferredTimeSlot(String preferredTimeSlot) {
        this.preferredTimeSlot = preferredTimeSlot;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public List<String> getEvidencePhotos() {
        return evidencePhotos;
    }

    public void setEvidencePhotos(List<String> evidencePhotos) {
        this.evidencePhotos = evidencePhotos;
    }

    public String getConsumerName() {
        return consumerName;
    }

    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
    }

    public String getConsumerPhone() {
        return consumerPhone;
    }

    public void setConsumerPhone(String consumerPhone) {
        this.consumerPhone = consumerPhone;
    }

    public static class AddressDTO {
        @NotNull
        @Size(min = 1)
        private String houseNo;

        @NotNull
        @Size(min = 1)
        private String locality;

        @NotNull
        @Size(min = 1)
        private String city;

        @NotNull
        @Size(min = 1)
        private String pinCode;

        public AddressDTO() {}

        public String getHouseNo() {
            return houseNo;
        }

        public void setHouseNo(String houseNo) {
            this.houseNo = houseNo;
        }

        public String getLocality() {
            return locality;
        }

        public void setLocality(String locality) {
            this.locality = locality;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getPinCode() {
            return pinCode;
        }

        public void setPinCode(String pinCode) {
            this.pinCode = pinCode;
        }
    }
}
