package com.technova.Repository;

import com.technova.Entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    @Query("SELECT sm FROM StockMovement sm ORDER BY sm.timestamp DESC")
    List<StockMovement> findRecentHistory();
}