package com.autokereskedes.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class UsedCarFilterDto {
    private String brand;
    private String model;
private String engine;
private Long engineId;
    private String body;          
    private String fuel;        
    private Integer yearFrom;
    private Integer yearTo;
    private Integer priceFrom;
    private Integer priceTo;

    private String typeCode;    
    private Integer mileageFrom;
    private Integer mileageTo;
    private Integer engineCcFrom; 
    private Integer engineCcTo;  
    private String condition;     
    private Integer doors;
    private Integer seats;
    private Boolean automatic;
    private Boolean cruiseControl;    
    private Boolean awd;             
    private Boolean alloyWheels;      
    private Boolean electricWindows;  
    private Boolean towHook;          
    private Boolean isofix;       
    private Boolean esp;             
    private Boolean serviceBook;     
    private Boolean veteran;          
    private Boolean isNewOrDemo;      
    private Boolean hasWarranty;     
    private Boolean rentable;        
    private Boolean hasDocuments;    
    private Boolean isUsed;           
    private Boolean historyChecked;   
    private Boolean ac;              
    private Boolean regValidHu;       
}
