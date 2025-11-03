package com.example.notification.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;
import java.util.Map;

@FeignClient(name = "conge-service", url = "http://localhost:8083/api/conges")
public interface CongeServiceClient {

    /**
     * 🔹 Récupère la liste des congés d’un employé (utilisé pour afficher l’historique
     * ou générer une notification de rappel).
     */
    @GetMapping("/employee/{employeeId}")
    List<Map<String, Object>> getCongesByEmployee(@PathVariable("employeeId") Long employeeId);

    /**
     * 🔹 Récupère les détails d’un congé précis.
     */
    @GetMapping("/{congeId}")
    Map<String, Object> getCongeById(@PathVariable("congeId") Long congeId);
}
