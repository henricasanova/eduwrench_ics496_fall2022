#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                    const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::shared_ptr<Workflow> &workflow,
                    const std::string &hostname);

    private:
        int main() override;
        void submitTask(std::string, std::string);

        std::set<std::shared_ptr<ComputeService>> compute_services;
        std::set<std::shared_ptr<StorageService>> storage_services;
        std::shared_ptr<Workflow> workflow;

        std::shared_ptr<JobManager> job_manager;

    };
};

#endif
