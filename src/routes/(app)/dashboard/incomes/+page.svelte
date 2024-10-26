<script>

let {data} = $props();
let incomeData = $derived(data?.incomeData?.data?.incomes ?? []);
$inspect(incomeData);
</script>

<div class="container">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Budgets</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover table-borderless">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each [1,2,3,4] as budget}
                                <tr>
                                    <td>1</td>
                                    <td>1200</td>
                                    <td>test</td>
                                    <td>test</td>
                                    <td>212-10-2024</td>
                                    <td>
                                        <a href="/#1" class="btn btn-primary">View</a>
                                    </td>
                                </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>