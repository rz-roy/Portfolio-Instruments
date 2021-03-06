// Instantiate Variables
let express = require('express');
let router = express.Router();
let db = require('../models');


// Dashboard /GET
router.get('/dashboardRowOne:user', (req, res) => {

    var taxable = 0;
    var traditional = 0;
    var roth = 0;
    var netWorth = 0;

    // Latest Snapshot Query
    db.sequelize.query('SELECT "users"."id", "users"."userName",  "users"."userPassword", "users"."benchmark", "users"."createdAt", "users"."updatedAt", "snapshots"."id" AS "snapshots.id", "snapshots"."title" AS "snapshots.title", "snapshots"."notes" AS "snapshots.notes", "snapshots"."userId" AS "snapshots.userId", "snapshots"."createdAt" AS "snapshots.createdAt", "snapshots"."updatedAt" AS "snapshots.updatedAt" FROM "users" AS "users" LEFT OUTER JOIN "snapshots" AS "snapshots" ON "users"."id" = "snapshots"."userId" WHERE "users"."userName" = ' + `'${req.params.user}' ` + 'ORDER by "snapshots"."createdAt" DESC',
    {model: db.users})
    .then(results => {

        // If a snapshot exists, return sums, otherwise, return 0's
        if ((results[0].dataValues['snapshots.id']) !== null){
            
            db.accounts.findAll({
                where: {snapshotId: (results[0].dataValues['snapshots.id'])}
                }).then(results => {
                    
                    results.forEach((data, index) => {

                        // Categorize account totals
                        if (data.dataValues.accountType === "Taxable") {
                            taxable += parseFloat(data.dataValues.total);
                        } 
                        else if (data.dataValues.accountType === "Roth") {
                            roth += parseFloat(data.dataValues.total);
                        }
                        else if (data.dataValues.accountType === "Traditional") {
                            traditional += parseFloat(data.dataValues.total);
                        }

                    })

                    netWorth = taxable + roth + traditional;

                    res.json({taxable: parseFloat(taxable).toFixed(2), roth: parseFloat(roth).toFixed(2), traditional: parseFloat(traditional).toFixed(2), netWorth: parseFloat(netWorth).toFixed(2)});

                })
            
        } else {

            res.json({taxable: 0.00, roth: 0.00, traditional: 0.00, netWorth: 0.00});

        }
            
    })

});

module.exports = router;